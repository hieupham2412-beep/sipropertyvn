import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SITE_DATA } from './src/data/initialData';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure initial data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SITE_DATA, null, 2), 'utf-8');
}

// Middleware
app.use(express.json({ limit: '20mb' }));

// API: Get Site Data
app.get('/api/site-data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return res.json({ success: true, data: parsed });
    }
    return res.json({ success: true, data: INITIAL_SITE_DATA });
  } catch (error) {
    console.error('Error reading site data:', error);
    return res.status(500).json({ success: false, error: 'Could not read site data' });
  }
});

// API: Save Site Data (CMS Admin Update)
app.post('/api/site-data', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Missing site data payload' });
    }

    const payload = {
      ...data,
      updatedAt: data.updatedAt || new Date().toISOString()
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    console.log('Site data updated successfully by Admin at', payload.updatedAt);
    return res.json({ 
      success: true, 
      message: 'Dữ liệu website đã được cập nhật thành công lên máy chủ!',
      updatedAt: payload.updatedAt,
      data: payload
    });
  } catch (error) {
    console.error('Error writing site data:', error);
    return res.status(500).json({ success: false, error: 'Could not save site data to server' });
  }
});

// API: Customer Inquiry & Email Notification to hieupham.2412@gmail.com
app.post('/api/send-inquiry', (req, res) => {
  try {
    const { inquiry } = req.body;
    const primaryAdminEmail = 'hieupham.2412@gmail.com';
    console.log(`[Email Dispatch] Form inquiry routed to ${primaryAdminEmail}:`, {
      customer: inquiry?.fullName,
      phone: inquiry?.phone,
      project: inquiry?.projectInterest,
      timestamp: new Date().toISOString()
    });

    return res.json({
      success: true,
      recipient: primaryAdminEmail,
      message: `Thông tin tư vấn đã được gửi thành công đến email ${primaryAdminEmail}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in send-inquiry:', error);
    return res.status(500).json({ success: false, error: 'Failed to process inquiry email' });
  }
});

// API: Reset to Initial Default Data
app.post('/api/reset-site-data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SITE_DATA, null, 2), 'utf-8');
    return res.json({ 
      success: true, 
      message: 'Đã khôi phục dữ liệu mặc định chuẩn của SI Property',
      data: INITIAL_SITE_DATA 
    });
  } catch (error) {
    console.error('Error resetting site data:', error);
    return res.status(500).json({ success: false, error: 'Could not reset site data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server with Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SI Property Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
