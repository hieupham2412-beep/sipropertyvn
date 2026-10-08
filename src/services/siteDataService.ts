import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import {
  loadSiteDataFromFirestore,
  saveSiteDataToFirestore,
  subscribeToSiteData,
} from './firebase';

const LOCAL_STORAGE_KEY = 'si_property_full_site_data_v2';

export async function fetchSiteData(): Promise<SiteData> {
  // 1. Read existing local data as fast fallback
  let localData: SiteData | null = null;
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.projects) {
        localData = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }

  // 2. Fetch server container data (Primary server file storage)
  let serverData: SiteData | null = null;
  try {
    const res = await fetch('/api/site-data');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.projects) {
        serverData = json.data;
      }
    }
  } catch (err) {
    console.warn('API /api/site-data not accessible', err);
  }

  // Determine the newest version between local and server sources
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
    // Sort descending by timestamp: index 0 is newest
    candidates.sort((a, b) => b.time - a.time);
    const newest = candidates[0].data;

    // Cache newest to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newest));
    } catch (e) {
      console.warn('Could not cache to localStorage', e);
    }

    // If local was newer than Server, propagate forward to server
    if (candidates[0].source !== 'server' && newest) {
      fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newest }),
      }).catch(() => {});
    }

    return newest;
  }

  // 3. Fallback to Initial Data
  return INITIAL_SITE_DATA;
}

export async function saveSiteDataToServer(
  data: SiteData
): Promise<{ success: boolean; message: string; updatedAt: string }> {
  const stampedData: SiteData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Layer 1: Always update local cache immediately (0ms)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stampedData));
  } catch (e) {
    console.warn('Failed saving to localStorage', e);
  }

  // Layer 2: Send to Express backend file (Direct server persistence)
  let serverSaved = false;
  try {
    const res = await fetch('/api/site-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: stampedData }),
    });
    if (res.ok) {
      serverSaved = true;
    }
  } catch (err) {
    console.warn('Server file backup warning:', err);
  }

  // Layer 3: Optional soft Firestore sync (quiet background, non-blocking)
  saveSiteDataToFirestore(stampedData).catch(() => {});

  const successMessage = serverSaved
    ? 'Đã lưu vĩnh viễn lên máy chủ website thành công (Hệ thống độc lập, không cần Google Cloud)!'
    : 'Đã lưu thành công vào trình duyệt!';

  return {
    success: true,
    message: successMessage,
    updatedAt: stampedData.updatedAt,
  };
}

export async function resetSiteDataToServer(): Promise<{ success: boolean; data: SiteData }> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
    await saveSiteDataToFirestore(INITIAL_SITE_DATA);
    const res = await fetch('/api/reset-site-data', { method: 'POST' });
    if (res.ok) {
      const result = await res.json();
      return { success: true, data: result.data || INITIAL_SITE_DATA };
    }
  } catch (err) {
    console.warn('Error resetting on server', err);
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
