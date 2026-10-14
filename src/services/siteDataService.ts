import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import {
  loadSiteDataFromFirestore,
  saveSiteDataToFirestore,
  subscribeToSiteData,
  checkFirestoreConnection,
  firestoreDbId,
} from './firebase';

const LOCAL_STORAGE_KEY = 'si_property_full_site_data_v2';

/**
 * Fetch the latest site data
 * Priority:
 * 1. Cloud Firestore (The central source of truth for all users across Netlify, custom domain, and devices)
 * 2. Local storage cache (If device is offline)
 * 3. Local server /api/site-data (If running inside a Node.js container)
 * 4. INITIAL_SITE_DATA fallback
 */
export async function fetchSiteData(): Promise<SiteData> {
  // 1. Fetch from Cloud Firestore (Direct Google Cloud source of truth)
  try {
    const cloudData = await loadSiteDataFromFirestore();
    if (cloudData && Array.isArray(cloudData.projects) && cloudData.projects.length > 0) {
      // Cache to localStorage for fast 0ms offline rendering
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData));
      } catch (e) {
        console.warn('Could not cache to localStorage', e);
      }
      return cloudData;
    }
  } catch (err) {
    console.warn('[SiteData] Firestore read fallback triggered:', err);
  }

  // 2. Read local cache as offline fallback
  let localData: SiteData | null = null;
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        localData = parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading localStorage', e);
  }

  // 3. Optional local express server file fallback
  let serverData: SiteData | null = null;
  try {
    const res = await fetch('/api/site-data');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.projects)) {
        serverData = json.data;
      }
    }
  } catch {
    // Expected on static hosting like Netlify
  }

  // Pick the newest between local and server if Firestore was unavailable
  const candidates: { source: string; data: SiteData; time: number }[] = [];
  if (localData && localData.projects) {
    candidates.push({
      source: 'local',
      data: localData,
      time: localData.updatedAt ? new Date(localData.updatedAt).getTime() : 1,
    });
  }
  if (serverData && serverData.projects) {
    candidates.push({
      source: 'server',
      data: serverData,
      time: serverData.updatedAt ? new Date(serverData.updatedAt).getTime() : 1,
    });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.time - a.time);
    const newest = candidates[0].data;
    // Attempt background sync to Firestore so cloud recovers
    saveSiteDataToFirestore(newest).catch(() => {});
    return newest;
  }

  // 4. Default Seed Data
  // Seed to Firestore in background
  saveSiteDataToFirestore(INITIAL_SITE_DATA).catch(() => {});
  return INITIAL_SITE_DATA;
}

/**
 * Save updated site data permanently (Cloud Firestore + Local Cache + Optional Server File)
 */
export async function saveSiteDataToServer(
  data: SiteData
): Promise<{ success: boolean; message: string; updatedAt: string; firestoreSaved: boolean }> {
  const stampedData: SiteData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to Local Cache (immediate 0ms responsiveness on this browser)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stampedData));
  } catch (e) {
    console.warn('Failed saving to localStorage', e);
  }

  // 2. SAVE TO GOOGLE CLOUD FIRESTORE (Permanent multi-device storage)
  const firestoreResult = await saveSiteDataToFirestore(stampedData);

  // 3. Optional backup to local Express server file (if available)
  fetch('/api/site-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: stampedData }),
  }).catch(() => {});

  if (firestoreResult.success) {
    return {
      success: true,
      firestoreSaved: true,
      message: '✅ Đã lưu vĩnh viễn lên Cloud Firestore! Toàn bộ người dùng trên Netlify và tên miền sẽ thấy dữ liệu mới ngay lập tức.',
      updatedAt: stampedData.updatedAt,
    };
  } else {
    return {
      success: true, // Saved locally at least
      firestoreSaved: false,
      message: `⚠️ Đã lưu trên trình duyệt, nhưng kết nối Firestore gặp sự cố: ${firestoreResult.message}`,
      updatedAt: stampedData.updatedAt,
    };
  }
}

/**
 * Import and permanently save data from a JSON object or string
 */
export async function importSiteDataFromJSON(
  rawJson: string | object
): Promise<{
  success: boolean;
  message: string;
  data?: SiteData;
  stats?: { projects: number; advisors: number; news: number };
}> {
  try {
    let parsed: any = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;

    // Check if the JSON is wrapped inside a data envelope e.g. { data: { ... } }
    if (parsed && parsed.data && (parsed.data.projects || parsed.data.advisors)) {
      parsed = parsed.data;
    }

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Dữ liệu JSON không hợp lệ.' };
    }

    // Validate that it has at least one essential collection
    const hasProjects = Array.isArray(parsed.projects) && parsed.projects.length > 0;
    const hasAdvisors = Array.isArray(parsed.advisors) && parsed.advisors.length > 0;
    const hasNews = Array.isArray(parsed.news) && parsed.news.length > 0;

    if (!hasProjects && !hasAdvisors && !hasNews) {
      return {
        success: false,
        message: 'Tệp JSON không chứa danh sách dự án, chuyên viên hoặc tin tức hợp lệ của SI Property.',
      };
    }

    // Merge with INITIAL_SITE_DATA to ensure no missing object keys
    const completeSiteData: SiteData = {
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_SITE_DATA.projects,
      advisors: Array.isArray(parsed.advisors) ? parsed.advisors : INITIAL_SITE_DATA.advisors,
      news: Array.isArray(parsed.news) ? parsed.news : INITIAL_SITE_DATA.news,
      careers: parsed.careers || INITIAL_SITE_DATA.careers,
      about: parsed.about || INITIAL_SITE_DATA.about,
      contact: parsed.contact || INITIAL_SITE_DATA.contact,
      general: parsed.general || INITIAL_SITE_DATA.general,
      pageHeaders: parsed.pageHeaders || INITIAL_SITE_DATA.pageHeaders,
      customerInquiries: Array.isArray(parsed.customerInquiries)
        ? parsed.customerInquiries
        : INITIAL_SITE_DATA.customerInquiries || [],
      updatedAt: new Date().toISOString(),
    };

    // Save permanently to Cloud Firestore
    const saveRes = await saveSiteDataToServer(completeSiteData);

    const stats = {
      projects: completeSiteData.projects.length,
      advisors: completeSiteData.advisors.length,
      news: completeSiteData.news.length,
    };

    if (saveRes.firestoreSaved) {
      return {
        success: true,
        data: completeSiteData,
        stats,
        message: `✅ Đã nạp và lưu vĩnh viễn lên Cloud Firestore: ${stats.projects} dự án, ${stats.advisors} chuyên viên, ${stats.news} tin tức!`,
      };
    } else {
      return {
        success: true,
        data: completeSiteData,
        stats,
        message: `⚠️ Đã nạp dữ liệu vào trình duyệt (${stats.projects} dự án, ${stats.advisors} chuyên viên), nhưng chưa đồng bộ được lên Cloud.`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Lỗi đọc tệp JSON: ' + (err?.message || 'Cấu trúc file không đúng'),
    };
  }
}

/**
 * Check cloud sync status live against Google Cloud Firestore
 */
export async function checkCloudSyncStatus() {
  const cloudInfo = await checkFirestoreConnection();
  let localUpdatedAt: string | null = null;
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const p = JSON.parse(local);
      localUpdatedAt = p?.updatedAt || null;
    }
  } catch {}

  return {
    ...cloudInfo,
    localUpdatedAt,
    databaseId: firestoreDbId,
  };
}

export async function resetSiteDataToServer(): Promise<{ success: boolean; data: SiteData }> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
    await saveSiteDataToFirestore(INITIAL_SITE_DATA);
    fetch('/api/reset-site-data', { method: 'POST' }).catch(() => {});
  } catch (err) {
    console.warn('Error resetting site data', err);
  }
  return { success: true, data: INITIAL_SITE_DATA };
}

export function exportSiteDataAsJSON(data: SiteData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `siproperty_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export { subscribeToSiteData };
