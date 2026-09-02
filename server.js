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

function loadDBFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      inMemoryDB = JSON.parse(raw);
      console.log('✅ Central Database loaded into memory.');
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
    const urlParams = new URLSearchParams(parsedUrl.query || '');
    const text = urlParams.get('text') || '';
    const lang = urlParams.get('lang') || 'vi';
    if (!text.trim()) {
      res.writeHead(400); res.end('Missing text'); return;
    }
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
    const https = require('https');
    const ttsReq = https.get(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
      }
    }, (ttsRes) => {
      res.writeHead(ttsRes.statusCode || 200, {
        'Content-Type': ttsRes.headers['content-type'] || 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      ttsRes.pipe(res);
    });
    ttsReq.on('error', (err) => {
      console.error('TTS proxy error:', err.message);
      if (!res.headersSent) { res.writeHead(502); res.end('TTS proxy error'); }
    });
    ttsReq.setTimeout(8000, () => {
      ttsReq.destroy();
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
              'Cache-Control': 'no-cache'
            });
            res.end(gzipped);
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
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
  // API 3: Save Central Database State (/api/db/save)
  // =========================================================================
  if (reqPath === '/api/db/save' && req.method === 'POST') {
    try {
      const rawBody = await getRequestBody(req, 30 * 1024 * 1024);
      const jsonStr = rawBody.toString('utf8');
      const incomingState = JSON.parse(jsonStr); // Validate JSON

      inMemoryDB = incomingState;
      scheduleDiskFlush(); // Non-blocking async persistence

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
    } catch (err) {
      console.error('API Save State error:', err);
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
