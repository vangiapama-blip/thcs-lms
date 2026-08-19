const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure storage directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

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

// Helper: read request body
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
        // Raw binary stream with filename header
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

      fs.writeFileSync(targetPath, fileBuffer);

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
  // API 2: Get Central Database State (/api/db/state)
  // =========================================================================
  if (reqPath === '/api/db/state' && req.method === 'GET') {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data);
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ initialized: false }));
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
      const rawBody = await getRequestBody(req, 20 * 1024 * 1024);
      const jsonStr = rawBody.toString('utf8');
      JSON.parse(jsonStr); // Validate JSON

      const tmpFile = DB_FILE + '.tmp';
      fs.writeFileSync(tmpFile, jsonStr, 'utf8');
      fs.renameSync(tmpFile, DB_FILE); // Atomic write

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
  // API 4: Backup Export (/api/backup)
  // =========================================================================
  if (reqPath === '/api/backup' && req.method === 'GET') {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const dateStr = new Date().toISOString().slice(0, 10);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="THCS_LMS_BACKUP_${dateStr}.json"`
        });
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Chưa có dữ liệu sao lưu.');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Lỗi sao lưu: ' + err.message);
    }
    return;
  }

  // =========================================================================
  // Static Files & Uploads Serving
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

    // Support streaming & range requests for Video and PDF
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
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` THCS LMS Central Server is running!`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://0.0.0.0:${PORT}`);
  console.log(` Storage: ${UPLOADS_DIR}`);
  console.log(` Data:    ${DB_FILE}`);
  console.log(`====================================================`);
});
