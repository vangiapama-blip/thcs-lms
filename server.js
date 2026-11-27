const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const os = require('os');

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure storage directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// =========================================================================
// 🚀 IN-MEMORY CENTRAL DATABASE ENGINE WITH ATOMIC PERSISTENCE QUEUE
// =========================================================================
let inMemoryDB = null;
let isSaving = false;
let saveScheduled = false;
let dbVersion = Date.now();
let lastModified = Date.now();

function sanitizeAndDeduplicate(db) {
  if (!db || typeof db !== 'object') return db;
  const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();

  // 1. Khử trùng lặp Lớp học (Classes)
  const rawClasses = Array.isArray(db.classesList) ? db.classesList : (Array.isArray(db.classes) ? db.classes : []);
  if (rawClasses.length > 0) {
    const cMap = new Map();
    rawClasses.forEach(c => {
      if (!c) return;
      const rawName = String(c.name || c.id || '').replace(/^Lớp\s*/i, '').trim();
      const nKey = rawName.toUpperCase();
      if (!nKey) return;
      let gradeNum = '6';
      const m = nKey.match(/\d+/);
      if (m) gradeNum = m[0];
      else if (c.grade) {
        const gm = String(c.grade).match(/\d+/);
        if (gm) gradeNum = gm[0];
      }
      const homeroom = (c.homeroomTeacher && c.homeroomTeacher !== 'Chưa phân công') ? c.homeroomTeacher : null;
      if (!cMap.has(nKey)) {
        cMap.set(nKey, {
          id: nKey,
          name: rawName,
          grade: 'Khối ' + gradeNum,
          homeroomTeacher: homeroom || 'Chưa phân công'
        });
      } else {
        const ex = cMap.get(nKey);
        if ((!ex.homeroomTeacher || ex.homeroomTeacher === 'Chưa phân công') && homeroom) {
          ex.homeroomTeacher = homeroom;
        }
      }
    });
    const sorted = Array.from(cMap.values()).sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    db.classesList = sorted;
    db.classes = sorted.map(c => ({
      id: c.name,
      name: c.name,
      grade: parseInt(String(c.grade).replace(/\D/g, '')) || 6,
      homeroomTeacher: c.homeroomTeacher || 'Chưa phân công'
    }));
  }

  // 2. Khử trùng lặp Giáo viên (Teachers)
  if (Array.isArray(db.teachers) && db.teachers.length > 0) {
    const tMap = new Map();
    db.teachers.forEach(t => {
      if (!t || !t.name) return;
      const nName = norm(t.name);
      if (!nName) return;
      const code = t.code ? String(t.code).trim().toUpperCase() : '';
      const key = code ? ('code:' + code) : ('name:' + nName);
      if (!tMap.has(key)) {
        const subList = Array.isArray(t.subjects) && t.subjects.length > 0 ? t.subjects : (t.subjectId ? [t.subjectId] : []);
        const classList = Array.isArray(t.classes) ? t.classes : [];
        tMap.set(key, { ...t, subjects: subList, classes: classList });
      } else {
        const ex = tMap.get(key);
        if (!ex.code && code) ex.code = code;
        if (!ex.phone && t.phone) ex.phone = t.phone;
        if (!ex.email && t.email) ex.email = t.email;
        if (!ex.dob && t.dob) ex.dob = t.dob;
        if (!ex.isHomeroom && t.isHomeroom) ex.isHomeroom = t.isHomeroom;
        if (!ex.username && t.username) ex.username = t.username;

        const tSubs = Array.isArray(t.subjects) && t.subjects.length > 0 ? t.subjects : (t.subjectId ? [t.subjectId] : []);
        ex.subjects = [...new Set([...(ex.subjects || []), ...tSubs])];
        ex.subjectId = ex.subjects[0] || ex.subjectId || 'toan';

        const tClasses = Array.isArray(t.classes) ? t.classes : [];
        ex.classes = [...new Set([...(ex.classes || []), ...tClasses])];
      }
    });
    db.teachers = Array.from(tMap.values());
  }

  // 3. Khử trùng lặp Học sinh (Students)
  if (Array.isArray(db.students) && db.students.length > 0) {
    const sMap = new Map();
    db.students.forEach((s, idx) => {
      if (!s || !s.name) return;
      const nName = norm(s.name);
      const cClass = String(s.classId || s.className || s.class || '').replace(/^Lớp\s*/i, '').trim().toUpperCase();
      const code = (s.studentCode || s.code) ? String(s.studentCode || s.code).trim().toUpperCase() : '';
      const sid = s.id ? String(s.id).trim().toUpperCase() : '';
      const sDob = s.dob ? String(s.dob).trim() : '';

      let key = '';
      if (code) {
        key = 'code:' + code;
      } else if (sid) {
        key = 'id:' + sid;
      } else if (sDob) {
        key = 'ncd:' + nName + '_' + cClass + '_' + sDob;
      } else {
        key = 'raw_' + idx;
      }

      if (!sMap.has(key)) {
        sMap.set(key, s);
      } else {
        const ex = sMap.get(key);
        if (!ex.studentCode && code) ex.studentCode = code;
        if (!ex.code && code) ex.code = code;
        if (!ex.dob && s.dob) ex.dob = s.dob;
        if (!ex.gender && s.gender) ex.gender = s.gender;
        if (!ex.phone && s.phone) ex.phone = s.phone;
        if (!ex.parentPhone && s.parentPhone) ex.parentPhone = s.parentPhone;
      }
    });
    db.students = Array.from(sMap.values());
  }

  // 4. Năm học (Academic Years)
  if (Array.isArray(db.academicYears) && db.academicYears.length > 0) {
    const yMap = new Map();
    db.academicYears.forEach(y => {
      if (!y) return;
      const rawId = String(y.id || '').replace('year_', '').replace('_', '-').trim();
      if (!rawId) return;
      if (!yMap.has(rawId)) {
        yMap.set(rawId, {
          id: rawId,
          name: y.name || ('Năm học ' + rawId),
          current: !!(y.current || y.isCurrent),
          isCurrent: !!(y.current || y.isCurrent)
        });
      }
    });
    if (!yMap.has('2026-2027')) yMap.set('2026-2027', { id: '2026-2027', name: 'Năm học 2026-2027', current: true, isCurrent: true });
    if (!yMap.has('2025-2026')) yMap.set('2025-2026', { id: '2025-2026', name: 'Năm học 2025-2026', current: false, isCurrent: false });
    db.academicYears = Array.from(yMap.values());
    if (db.selectedSchoolYear) {
      db.selectedSchoolYear = String(db.selectedSchoolYear).replace('year_', '').replace('_', '-').trim();
    }
  }

  return db;
}

function loadDBFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      inMemoryDB = JSON.parse(raw);
      inMemoryDB = sanitizeAndDeduplicate(inMemoryDB);
      dbVersion = (inMemoryDB && inMemoryDB._version) ? inMemoryDB._version : Date.now();
      lastModified = (inMemoryDB && inMemoryDB._lastModified) ? inMemoryDB._lastModified : Date.now();
      inMemoryDB._version = dbVersion;
      inMemoryDB._lastModified = lastModified;
      console.log('✅ Central Database loaded into memory and deduplicated. Version:', dbVersion);
    } else {
      inMemoryDB = {
        schoolInfo: { name: 'TH-THCS AMA TRANG LƠNG', address: 'Dliê Ya, Đắk Lắk' },
        teachers: [],
        students: [],
        classes: [],
        subjects: [],
        questions: [],
        exams: [],
        assignments: [],
        submissions: [],
        examAttempts: [],
        uploadedFiles: [],
        attendance: [],
        teachingTools: []
      };
      inMemoryDB = sanitizeAndDeduplicate(inMemoryDB);
      inMemoryDB._version = dbVersion;
      inMemoryDB._lastModified = lastModified;
      fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDB, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('❌ Error reading database.json:', err);
    inMemoryDB = inMemoryDB || {};
  }
}

loadDBFromDisk();

// Debounced Async Disk Flush (Prevents I/O Bottleneck under 3000 Concurrent Users)
function scheduleDiskFlush() {
  if (saveScheduled) return;
  saveScheduled = true;
  setTimeout(async () => {
    saveScheduled = false;
    if (isSaving) {
      scheduleDiskFlush();
      return;
    }
    isSaving = true;
    try {
      const dataStr = JSON.stringify(inMemoryDB);
      const tmpFile = DB_FILE + '.tmp';
      await fs.promises.writeFile(tmpFile, dataStr, 'utf8');
      await fs.promises.rename(tmpFile, DB_FILE); // Atomic replace
    } catch (err) {
      console.error('❌ Disk flush error:', err);
    } finally {
      isSaving = false;
    }
  }, 300); // 300ms debounce
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.mp4': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed'
};

// Static File In-Memory Cache for High-Frequency Assets (Index, App, Tools)
const staticCache = new Map();
const COMPRESSIBLE_TYPES = new Set(['text/html; charset=utf-8', 'text/css; charset=utf-8', 'application/javascript; charset=utf-8', 'application/json; charset=utf-8']);

function getRequestBody(req, maxBytes = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        req.destroy();
        reject(new Error('Payload Too Large'));
      } else {
        body.push(chunk);
      }
    });
    req.on('end', () => resolve(Buffer.concat(body)));
    req.on('error', reject);
  });
}

function sanitizeFilename(str) {
  return (str || 'file')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_');
}

// =========================================================================
// 🛡️ LIVE EXAM PROCTORING ROOM ENGINE (SSE + VOICE ALERT RELAY)
// =========================================================================
const proctorRooms = new Map();

function getOrCreateProctorRoom(examId) {
  const id = String(examId || '').trim();
  if (!id) return null;
  if (!proctorRooms.has(id)) {
    proctorRooms.set(id, {
      examId: id,
      lateThresholdMinutes: 5,
      openTime: null,
      students: new Map(),
      teacherClients: new Set(),
      studentClients: new Map(),
      createdAt: Date.now()
    });
  }
  return proctorRooms.get(id);
}

function computeLateInfo(joinedAtMs, openTimeStr, thresholdMin) {
  if (!openTimeStr || !joinedAtMs) return { isLate: false, lateMinutes: 0 };
  const openMs = new Date(openTimeStr).getTime();
  if (isNaN(openMs)) return { isLate: false, lateMinutes: 0 };
  const grace = Math.max(0, Number(thresholdMin) || 0) * 60000;
  if (joinedAtMs > openMs + grace) {
    return {
      isLate: true,
      lateMinutes: Math.max(1, Math.round((joinedAtMs - openMs) / 60000))
    };
  }
  return { isLate: false, lateMinutes: 0 };
}

function serializeProctorStudent(st, now = Date.now()) {
  let effectiveStatus = st.status || 'online';
  if (effectiveStatus === 'online' && st.lastHeartbeat && (now - st.lastHeartbeat > 18000)) {
    effectiveStatus = 'disconnected';
  }
  return {
    studentId: st.studentId,
    studentName: st.studentName,
    classId: st.classId || '',
    status: effectiveStatus,
    joinedAt: st.joinedAt,
    lastHeartbeat: st.lastHeartbeat,
    isLate: !!st.isLate,
    lateMinutes: st.lateMinutes || 0,
    answeredCount: st.answeredCount || 0,
    totalCount: st.totalCount || 0,
    violationCount: st.violationCount || 0,
    violations: (st.violations || []).slice(-10),
    lastSnapshot: st.lastSnapshot || null,
    camActive: !!st.camActive,
    micActive: !!st.micActive,
    submittedAt: st.submittedAt || null,
    score: st.score !== undefined ? st.score : null,
    reminders: (st.reminders || []).slice(-10)
  };
}

function serializeProctorRoom(room) {
  const now = Date.now();
  const students = Array.from(room.students.values()).map(st => serializeProctorStudent(st, now));
  return {
    examId: room.examId,
    lateThresholdMinutes: room.lateThresholdMinutes,
    openTime: room.openTime,
    students,
    serverTime: now
  };
}

function broadcastProctorTeachers(room, eventType, payload) {
  if (!room || !room.teacherClients || room.teacherClients.size === 0) return;
  const msg = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  room.teacherClients.forEach(clientRes => {
    try { clientRes.write(msg); } catch (e) {}
  });
}

function pushProctorStudentAlert(room, targetStudentId, alertObj) {
  if (!room) return 0;
  const targets = (targetStudentId === 'ALL')
    ? Array.from(room.students.keys())
    : [String(targetStudentId)];
  let deliveredCount = 0;

  targets.forEach(sid => {
    const st = room.students.get(sid);
    if (st) {
      if (!st.reminders) st.reminders = [];
      st.reminders.push({
        id: alertObj.id,
        mode: alertObj.mode,
        message: alertObj.message,
        teacherName: alertObj.teacherName,
        timestamp: alertObj.timestamp,
        ackedAt: null
      });
      if (st.reminders.length > 20) st.reminders.shift();

      if (!st.pendingAlerts) st.pendingAlerts = [];
      st.pendingAlerts.push(alertObj);
      if (st.pendingAlerts.length > 5) st.pendingAlerts.shift();
    }

    const clients = room.studentClients.get(sid);
    if (clients && clients.size > 0) {
      const msg = `event: proctor_alert\ndata: ${JSON.stringify(alertObj)}\n\n`;
      clients.forEach(cRes => {
        try { cRes.write(msg); deliveredCount++; } catch (e) {}
      });
    }
  });
  return deliveredCount;
}

async function readJsonBody(req, maxBytes = 4 * 1024 * 1024) {
  const raw = await getRequestBody(req, maxBytes);
  if (!raw || raw.length === 0) return {};
  return JSON.parse(raw.toString('utf8'));
}

function sendJson(res, statusCode, obj) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = urlParts[0];

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-file-name');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // =========================================================================
  // 🩺 RENDER CLOUD HEALTHCHECK
  // =========================================================================
  if (reqPath === '/health' || reqPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() }));
    return;
  }

  // =========================================================================
  // 🎙️ API: TTS PROXY — Giọng Nữ Tiếng Việt Gốc (Bypass CORS cho Render)
  // Trình duyệt online không thể gọi translate.google.com trực tiếp (CORS)
  // Server làm proxy: fetch Google TTS → pipe audio về trình duyệt
  // =========================================================================
  if (reqPath === '/api/tts' && req.method === 'GET') {
    // urlParts[1] là phần query string (e.g. "lang=vi&text=Mời em lên bảng")
    const urlParams = new URLSearchParams(urlParts[1] || '');
    const text = urlParams.get('text') || '';
    const lang = urlParams.get('lang') || 'vi';
    console.log(`[TTS] lang=${lang} text="${text.slice(0, 50)}"`);
    if (!text.trim()) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing text');
      return;
    }
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
    const https = require('https');
    const ttsReq = https.get(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
      }
    }, (ttsRes) => {
      console.log(`[TTS] Google response: ${ttsRes.statusCode} ${ttsRes.headers['content-type']}`);
      res.writeHead(ttsRes.statusCode || 200, {
        'Content-Type': ttsRes.headers['content-type'] || 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      ttsRes.pipe(res);
    });
    ttsReq.on('error', (err) => {
      console.error('[TTS] Proxy error:', err.message);
      if (!res.headersSent) { res.writeHead(502); res.end('TTS proxy error'); }
    });
    ttsReq.setTimeout(10000, () => {
      ttsReq.destroy();
      console.error('[TTS] Timeout!');
      if (!res.headersSent) { res.writeHead(504); res.end('TTS timeout'); }
    });
    return;
  }

  // =========================================================================
  // API: Wireless Mobile Camera Streaming & QR Code Endpoint
  // =========================================================================
      if (reqPath === '/api/server-ip' && req.method === 'GET') {
    const ip = getLocalIP();
    const host = req.headers['x-forwarded-host'] || req.headers.host || `${ip}:${PORT}`;
    const proto = req.headers['x-forwarded-proto'] || (req.connection && req.connection.encrypted ? 'https' : 'http');
    const currentOrigin = `${proto}://${host}`;
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      ip: ip,
      port: PORT,
      url: `${currentOrigin}/mobile-cam.html`,
      plickersUrl: `${currentOrigin}/plickers-mobile.html`,
      appUrl: `${currentOrigin}/plickers-mobile.html`,
      localUrl: `${currentOrigin}/cai-dat-app.html`
    }));
    return;
  }

  // Real-time camera frames in memory
  if (!global.cameraStreamStore) {
    global.cameraStreamStore = {
      latestFrame: null,
      lastUpdate: 0,
      activeClients: new Set()
    };
  }

  if (reqPath === '/api/cam-stream/push' && req.method === 'POST') {
    try {
      const raw = await getRequestBody(req, 10 * 1024 * 1024);
      const data = JSON.parse(raw.toString('utf8'));
      global.cameraStreamStore.latestFrame = data.image;
      global.cameraStreamStore.lastUpdate = Date.now();
      
      global.cameraStreamStore.activeClients.forEach(clientRes => {
        try {
          clientRes.write(`data: ${JSON.stringify({ image: data.image, ts: global.cameraStreamStore.lastUpdate })}\n\n`);
        } catch(e) {}
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (reqPath === '/api/cam-stream/live' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    
    global.cameraStreamStore.activeClients.add(res);

    if (global.cameraStreamStore.latestFrame) {
      res.write(`data: ${JSON.stringify({ image: global.cameraStreamStore.latestFrame, ts: global.cameraStreamStore.lastUpdate })}\n\n`);
    }

    req.on('close', () => {
      global.cameraStreamStore.activeClients.delete(res);
    });
    return;
  }


  // =========================================================================
  // PLICKERS AI MOBILE SCANNER REAL-TIME SSE SYNC STORE
  // =========================================================================
  if (!global.plickersStreamStore) {
    global.plickersStreamStore = {
      activeClients: new Set(),
      currentState: {
        classId: '6A',
        questionIdx: 0,
        totalQuestions: 4,
        totalStudents: 40,
        scanned: {}
      }
    };
  }

  // Broadcast helper
  const broadcastPlickersEvent = (eventData) => {
    if (!global.plickersStreamStore) return;
    const payload = `data: ${JSON.stringify(eventData)}\n\n`;
    global.plickersStreamStore.activeClients.forEach(clientRes => {
      try {
        clientRes.write(payload);
      } catch(e) {}
    });
  };

  // SSE Stream Endpoint for Desktop & Mobile
  if (reqPath === '/api/plickers/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    global.plickersStreamStore.activeClients.add(res);

    // Send initial state
    res.write(`data: ${JSON.stringify({ type: 'state_update', ...global.plickersStreamStore.currentState })}\n\n`);

    req.on('close', () => {
      global.plickersStreamStore.activeClients.delete(res);
    });
    return;
  }

  // Mobile notifies that it has connected
  if (reqPath === '/api/plickers/phone-connected' && req.method === 'POST') {
    broadcastPlickersEvent({
      type: 'phone_connected',
      ts: Date.now()
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, connected: true }));
    return;
  }

  // Mobile pushes a scanned student card
  if (reqPath === '/api/plickers/scan' && req.method === 'POST') {
    try {
      const raw = await getRequestBody(req, 1024 * 1024);
      const data = JSON.parse(raw.toString('utf8'));
      
      broadcastPlickersEvent({
        type: 'scan_result',
        studentIndex: data.studentIndex,
        studentName: data.studentName,
        classId: data.classId,
        answer: data.answer,
        rawData: data.rawData,
        ts: Date.now()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Mobile sends a remote control action ('reveal' | 'next' | 'reset')
  if (reqPath === '/api/plickers/control' && req.method === 'POST') {
    try {
      const raw = await getRequestBody(req, 1024 * 1024);
      const data = JSON.parse(raw.toString('utf8'));
      
      broadcastPlickersEvent({
        type: 'control_action',
        action: data.action,
        ts: Date.now()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Desktop updates active question / class state
  if (reqPath === '/api/plickers/state' && req.method === 'POST') {
    try {
      const raw = await getRequestBody(req, 1024 * 1024);
      const data = JSON.parse(raw.toString('utf8'));
      
      Object.assign(global.plickersStreamStore.currentState, data);

      broadcastPlickersEvent({
        type: 'state_update',
        ...global.plickersStreamStore.currentState,
        ts: Date.now()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // =========================================================================
  // 🛡️ API PHÒNG GIÁM SÁT THI REAL-TIME (/api/proctor/*)
  // =========================================================================
  if (reqPath === '/api/proctor/stream' && req.method === 'GET') {
    const params = new URLSearchParams(urlParts[1] || '');
    const examId = params.get('examId') || '';
    const role = params.get('role') || 'student';
    const studentId = params.get('studentId') || '';
    const room = getOrCreateProctorRoom(examId);
    if (!room) {
      sendJson(res, 400, { success: false, error: 'Missing examId' });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });

    if (role === 'teacher') {
      room.teacherClients.add(res);
      res.write(`event: room_snapshot\ndata: ${JSON.stringify(serializeProctorRoom(room))}\n\n`);
    } else if (studentId) {
      if (!room.studentClients.has(studentId)) room.studentClients.set(studentId, new Set());
      room.studentClients.get(studentId).add(res);
      const st = room.students.get(studentId);
      if (st && Array.isArray(st.pendingAlerts) && st.pendingAlerts.length > 0) {
        st.pendingAlerts.forEach(al => {
          res.write(`event: proctor_alert\ndata: ${JSON.stringify(al)}\n\n`);
        });
      }
    }

    const pingTimer = setInterval(() => {
      try { res.write(': ping\n\n'); } catch (e) {}
    }, 20000);

    req.on('close', () => {
      clearInterval(pingTimer);
      if (role === 'teacher') {
        room.teacherClients.delete(res);
      } else if (studentId && room.studentClients.has(studentId)) {
        room.studentClients.get(studentId).delete(res);
      }
    });
    return;
  }

  if (reqPath === '/api/proctor/room-state' && req.method === 'GET') {
    const params = new URLSearchParams(urlParts[1] || '');
    const examId = params.get('examId') || '';
    const room = getOrCreateProctorRoom(examId);
    if (!room) { sendJson(res, 400, { success: false, error: 'Missing examId' }); return; }
    sendJson(res, 200, { success: true, ...serializeProctorRoom(room) });
    return;
  }

  if (reqPath === '/api/proctor/config' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const room = getOrCreateProctorRoom(body.examId);
      if (!room) { sendJson(res, 400, { success: false, error: 'Missing examId' }); return; }
      if (body.lateThresholdMinutes !== undefined) {
        room.lateThresholdMinutes = Math.max(0, Number(body.lateThresholdMinutes) || 0);
      }
      if (body.openTime) room.openTime = body.openTime;
      room.students.forEach(st => {
        const info = computeLateInfo(st.joinedAt, room.openTime, room.lateThresholdMinutes);
        st.isLate = info.isLate;
        st.lateMinutes = info.lateMinutes;
      });
      broadcastProctorTeachers(room, 'room_snapshot', serializeProctorRoom(room));
      sendJson(res, 200, { success: true, ...serializeProctorRoom(room) });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/join' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const room = getOrCreateProctorRoom(body.examId);
      const sid = String(body.studentId || '').trim();
      if (!room || !sid) { sendJson(res, 400, { success: false, error: 'Missing examId or studentId' }); return; }
      if (body.openTime && !room.openTime) room.openTime = body.openTime;
      const now = Date.now();
      const prev = room.students.get(sid);
      const joinedAt = (prev && prev.joinedAt) ? prev.joinedAt : now;
      const lateInfo = body.isPreviewMode
        ? { isLate: false, lateMinutes: 0 }
        : computeLateInfo(joinedAt, body.openTime || room.openTime, room.lateThresholdMinutes);

      const st = {
        studentId: sid,
        studentName: body.studentName || (prev && prev.studentName) || sid,
        classId: body.classId || (prev && prev.classId) || '',
        status: 'online',
        joinedAt,
        lastHeartbeat: now,
        isLate: lateInfo.isLate,
        lateMinutes: lateInfo.lateMinutes,
        answeredCount: prev ? (prev.answeredCount || 0) : 0,
        totalCount: Number(body.totalCount) || (prev ? prev.totalCount : 0),
        violationCount: prev ? (prev.violationCount || 0) : 0,
        violations: prev ? (prev.violations || []) : [],
        lastSnapshot: prev ? prev.lastSnapshot : null,
        camActive: !!body.camActive,
        micActive: !!body.micActive,
        submittedAt: null,
        score: null,
        reminders: prev ? (prev.reminders || []) : [],
        pendingAlerts: prev ? (prev.pendingAlerts || []) : []
      };
      room.students.set(sid, st);
      const serialized = serializeProctorStudent(st, now);
      broadcastProctorTeachers(room, 'student_update', serialized);
      sendJson(res, 200, { success: true, student: serialized });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/heartbeat' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req, 1024 * 1024);
      const room = getOrCreateProctorRoom(body.examId);
      const sid = String(body.studentId || '').trim();
      if (!room || !sid) { sendJson(res, 400, { success: false }); return; }
      const now = Date.now();
      let st = room.students.get(sid);
      if (!st) {
        st = {
          studentId: sid,
          studentName: body.studentName || sid,
          classId: body.classId || '',
          status: 'online',
          joinedAt: now,
          lastHeartbeat: now,
          isLate: false,
          lateMinutes: 0,
          answeredCount: 0,
          totalCount: Number(body.totalCount) || 0,
          violationCount: 0,
          violations: [],
          lastSnapshot: null,
          reminders: [],
          pendingAlerts: []
        };
        room.students.set(sid, st);
      }
      if (st.status !== 'submitted') st.status = 'online';
      st.lastHeartbeat = now;
      if (body.answeredCount !== undefined) st.answeredCount = Number(body.answeredCount) || 0;
      if (body.totalCount !== undefined) st.totalCount = Number(body.totalCount) || st.totalCount;
      if (body.camActive !== undefined) st.camActive = !!body.camActive;
      if (body.micActive !== undefined) st.micActive = !!body.micActive;
      if (body.snapshot) st.lastSnapshot = body.snapshot;

      const serialized = serializeProctorStudent(st, now);
      broadcastProctorTeachers(room, 'student_update', serialized);
      const pendingAlerts = Array.isArray(st.pendingAlerts) ? st.pendingAlerts : [];
      sendJson(res, 200, { success: true, pendingAlerts });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/violation' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req, 2 * 1024 * 1024);
      const room = getOrCreateProctorRoom(body.examId);
      const sid = String(body.studentId || '').trim();
      if (!room || !sid) { sendJson(res, 400, { success: false }); return; }
      const now = Date.now();
      let st = room.students.get(sid);
      if (!st) {
        st = {
          studentId: sid,
          studentName: body.studentName || sid,
          classId: body.classId || '',
          status: 'online',
          joinedAt: now,
          lastHeartbeat: now,
          isLate: false,
          lateMinutes: 0,
          answeredCount: 0,
          totalCount: 0,
          violationCount: 0,
          violations: [],
          lastSnapshot: null,
          reminders: [],
          pendingAlerts: []
        };
        room.students.set(sid, st);
      }
      st.lastHeartbeat = now;
      st.violationCount = Math.max((st.violationCount || 0) + 1, Number(body.violationCount) || 0);
      const vEntry = {
        id: `viol_${now}_${Math.floor(Math.random() * 1000)}`,
        reason: body.reason || 'Vi phạm quy chế phòng thi',
        timestamp: body.timestamp || new Date().toISOString(),
        snapshot: body.snapshot || null
      };
      if (!st.violations) st.violations = [];
      st.violations.push(vEntry);
      if (st.violations.length > 15) {
        st.violations = st.violations.map((v, idx) => idx < st.violations.length - 8 ? { ...v, snapshot: null } : v);
      }
      if (body.snapshot) st.lastSnapshot = body.snapshot;

      const serialized = serializeProctorStudent(st, now);
      broadcastProctorTeachers(room, 'student_violation', { student: serialized, violation: vEntry });
      sendJson(res, 200, { success: true, student: serialized });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/submit' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const room = getOrCreateProctorRoom(body.examId);
      const sid = String(body.studentId || '').trim();
      if (!room || !sid) { sendJson(res, 400, { success: false }); return; }
      const st = room.students.get(sid);
      if (st) {
        st.status = 'submitted';
        st.submittedAt = body.submitTime || new Date().toISOString();
        st.score = body.score !== undefined ? body.score : st.score;
        if (body.totalCount !== undefined) st.answeredCount = Number(body.totalCount) || st.answeredCount;
        broadcastProctorTeachers(room, 'student_update', serializeProctorStudent(st));
      }
      sendJson(res, 200, { success: true });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/voice-alert' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req, 4 * 1024 * 1024);
      const room = getOrCreateProctorRoom(body.examId);
      if (!room || !body.targetStudentId) {
        sendJson(res, 400, { success: false, error: 'Missing examId or targetStudentId' });
        return;
      }
      const alertObj = {
        id: `alt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        examId: room.examId,
        targetStudentId: String(body.targetStudentId),
        mode: body.mode || (body.audioDataUrl ? 'voice' : 'tts'),
        message: body.message || '',
        audioDataUrl: body.audioDataUrl || null,
        teacherName: body.teacherName || 'Giám thị phòng thi',
        timestamp: Date.now()
      };
      const delivered = pushProctorStudentAlert(room, body.targetStudentId, alertObj);
      broadcastProctorTeachers(room, 'room_snapshot', serializeProctorRoom(room));
      sendJson(res, 200, { success: true, alertId: alertObj.id, delivered });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/ack' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const room = getOrCreateProctorRoom(body.examId);
      const sid = String(body.studentId || '').trim();
      const alertId = String(body.alertId || '').trim();
      if (!room || !sid) { sendJson(res, 400, { success: false }); return; }
      const st = room.students.get(sid);
      if (st) {
        if (Array.isArray(st.pendingAlerts)) {
          st.pendingAlerts = st.pendingAlerts.filter(a => a.id !== alertId);
        }
        if (Array.isArray(st.reminders)) {
          const rem = st.reminders.find(r => r.id === alertId);
          if (rem) rem.ackedAt = Date.now();
        }
        broadcastProctorTeachers(room, 'student_update', serializeProctorStudent(st));
      }
      sendJson(res, 200, { success: true });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  if (reqPath === '/api/proctor/command' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const room = getOrCreateProctorRoom(body.examId);
      if (!room || !body.targetStudentId || !body.action) {
        sendJson(res, 400, { success: false, error: 'Missing required fields' });
        return;
      }
      const cmdObj = {
        id: `cmd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        examId: room.examId,
        targetStudentId: String(body.targetStudentId),
        mode: 'command',
        action: body.action, // 'force_submit'
        message: body.reason || 'Giám thị yêu cầu kết thúc bài thi ngay lập tức.',
        teacherName: body.teacherName || 'Giám thị phòng thi',
        timestamp: Date.now()
      };
      const delivered = pushProctorStudentAlert(room, body.targetStudentId, cmdObj);
      broadcastProctorTeachers(room, 'room_snapshot', serializeProctorRoom(room));
      sendJson(res, 200, { success: true, alertId: cmdObj.id, delivered });
    } catch (e) {
      sendJson(res, 400, { success: false, error: e.message });
    }
    return;
  }

  // =========================================================================
  // API 1: File Upload (PDF, Word, PPTX, Video, Images) -> Save to /uploads/
  // =========================================================================
  if (reqPath === '/api/upload' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req, 100 * 1024 * 1024); // Up to 100MB
      let fileBuffer = null;
      let originalName = 'uploaded_file';
      let fileExt = '.bin';

      const contentType = req.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        const json = JSON.parse(rawBody.toString('utf8'));
        originalName = json.filename || json.name || 'file';
        const fileData = json.fileData || json.dataUrl || '';
        
        if (fileData.includes('base64,')) {
          fileBuffer = Buffer.from(fileData.split('base64,')[1], 'base64');
        } else {
          fileBuffer = Buffer.from(fileData, 'base64');
        }
      } else {
        originalName = decodeURIComponent(req.headers['x-file-name'] || 'uploaded_file');
        fileBuffer = rawBody;
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: 'Dữ liệu tệp không hợp lệ hoặc rỗng.' }));
        return;
      }

      const parsedExt = path.extname(originalName).toLowerCase();
      fileExt = parsedExt || '.bin';
      const baseName = path.basename(originalName, parsedExt);
      const safeName = `${sanitizeFilename(baseName)}_${Date.now()}${fileExt}`;
      const targetPath = path.join(UPLOADS_DIR, safeName);

      await fs.promises.writeFile(targetPath, fileBuffer);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        url: `/uploads/${safeName}`,
        name: originalName,
        size: fileBuffer.length,
        ext: fileExt,
        uploadDate: new Date().toISOString()
      }));
    } catch (err) {
      console.error('API Upload error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: err.message || 'Lỗi khi lưu tệp vào máy chủ.' }));
    }
    return;
  }

  // =========================================================================
  // API 2: High-Performance Central Database State (/api/db/state)
  // =========================================================================
  if (reqPath === '/api/db/state' && req.method === 'GET') {
    try {
      if (inMemoryDB) {
        inMemoryDB._version = dbVersion;
        inMemoryDB._lastModified = lastModified;
      }
      const dataStr = JSON.stringify(inMemoryDB || {});
      const acceptEncoding = req.headers['accept-encoding'] || '';

      if (acceptEncoding.includes('gzip')) {
        zlib.gzip(Buffer.from(dataStr), (err, gzipped) => {
          if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(dataStr);
          } else {
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Encoding': 'gzip',
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
            });
            res.end(gzipped);
          }
        });
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        });
        res.end(dataStr);
      }
    } catch (err) {
      console.error('API Get State error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // =========================================================================
  // API 2b: Real-time Central Database Version & Heartbeat (/api/db/version)
  // =========================================================================
  if (reqPath === '/api/db/version' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });
    const counts = {
      teachers: Array.isArray(inMemoryDB?.teachers) ? inMemoryDB.teachers.length : 0,
      classes: Array.isArray(inMemoryDB?.classesList) ? inMemoryDB.classesList.length : (Array.isArray(inMemoryDB?.classes) ? inMemoryDB.classes.length : 0),
      students: Array.isArray(inMemoryDB?.students) ? inMemoryDB.students.length : 0
    };
    res.end(JSON.stringify({
      version: dbVersion,
      lastModified: lastModified,
      counts: counts
    }));
    return;
  }

  // =========================================================================
  // API 3: Save Central Database State (/api/db/save)
  // =========================================================================
  if (reqPath === '/api/db/save' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req, 30 * 1024 * 1024);
      const jsonStr = rawBody.toString('utf8');
      const incomingState = JSON.parse(jsonStr); // Validate JSON

      inMemoryDB = sanitizeAndDeduplicate(incomingState);
      dbVersion++;
      lastModified = Date.now();
      inMemoryDB._version = dbVersion;
      inMemoryDB._lastModified = lastModified;

      scheduleDiskFlush(); // Non-blocking async persistence

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, version: dbVersion, timestamp: lastModified }));
    } catch (err) {
      console.error('API Save State error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // =========================================================================
  // API 3b: Clear / Reset Core Database (/api/db/clear)
  // =========================================================================
  if (reqPath === '/api/db/clear' && req.method === 'POST') {
    try {
      if (inMemoryDB) {
        inMemoryDB.teachers = [];
        inMemoryDB.students = [];
        inMemoryDB.classes = [];
        inMemoryDB.classesList = [];
        inMemoryDB.parents = [];
        inMemoryDB.submissions = [];
        inMemoryDB.examAttempts = [];
        inMemoryDB.attendance = [];
        inMemoryDB._clearedAt = Date.now();
        dbVersion++;
        lastModified = Date.now();
        inMemoryDB._version = dbVersion;
        inMemoryDB._lastModified = lastModified;
        scheduleDiskFlush();
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, version: dbVersion, timestamp: lastModified }));
    } catch (err) {
      console.error('API Clear State error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // =========================================================================
  // API 4: Fast Concurrent Submission Endpoint (/api/db/submit-exam)
  // =========================================================================
  if (reqPath === '/api/db/submit-exam' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req, 5 * 1024 * 1024);
      const attempt = JSON.parse(rawBody.toString('utf8'));

      if (!inMemoryDB.examAttempts) inMemoryDB.examAttempts = [];
      inMemoryDB.examAttempts.unshift(attempt);
      scheduleDiskFlush();

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, attemptId: attempt.id }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // =========================================================================
  // API 5: Backup Export (/api/backup)
  // =========================================================================
  if (reqPath === '/api/backup' && req.method === 'GET') {
    try {
      const dataStr = JSON.stringify(inMemoryDB || {}, null, 2);
      const dateStr = new Date().toISOString().slice(0, 10);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="THCS_LMS_BACKUP_${dateStr}.json"`
      });
      res.end(dataStr);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Lỗi sao lưu: ' + err.message);
    }
    return;
  }

  // =========================================================================
  // ⚡ HIGH-SPEED STATIC ASSET SERVING WITH GZIP COMPRESSION & CACHING
  // =========================================================================
  let fileRelative = reqPath === '/' ? '/index.html' : reqPath;
  let filePath = path.join(PUBLIC_DIR, decodeURIComponent(fileRelative));

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isCompressible = COMPRESSIBLE_TYPES.has(contentType);
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Video / PDF streaming
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.pdf' || ext === '.webm' || ext === '.mov')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fileStream.pipe(res);
      return;
    }

    // Serve with Gzip compression if supported
    if (isCompressible && acceptEncoding.includes('gzip')) {
      fs.readFile(filePath, (readErr, fileBuf) => {
        if (readErr) {
          res.writeHead(500);
          res.end();
          return;
        }
        zlib.gzip(fileBuf, (zipErr, gzippedBuf) => {
          if (zipErr) {
            res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': fileBuf.length });
            res.end(fileBuf);
          } else {
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Content-Length': gzippedBuf.length,
              'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(gzippedBuf);
          }
        });
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'

      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

// Render/Proxy Keep-Alive timeouts
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` 🚀 THCS LMS High-Performance Render Server Ready!`);
  console.log(` Port:    ${PORT}`);
  console.log(` Gzip:    Enabled for High Concurrency (3000+ users)`);
  console.log(` Memory:  In-Memory Engine with Async Debounced Flush`);
  console.log(` Storage: ${UPLOADS_DIR}`);
  console.log(` Data:    ${DB_FILE}`);
  console.log(`====================================================`);
});
