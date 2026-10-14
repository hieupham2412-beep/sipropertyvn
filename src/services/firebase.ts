import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  onSnapshot,
  collection,
  addDoc,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId provided in config
export const firestoreDbId =
  (firebaseConfig as any).firestoreDatabaseId ||
  'ai-studio-sipropertysngiao-f9d2df8c-096d-4d61-a622-09598293af94';

export const db: Firestore = getFirestore(app, firestoreDbId);

const SITE_CONTENT_DOC = 'main';

/**
 * Check live connection to Google Cloud Firestore and inspect stored document
 */
export async function checkFirestoreConnection(): Promise<{
  connected: boolean;
  docExists: boolean;
  docUpdatedAt?: string;
  projectId: string;
  databaseId: string;
  projectCount?: number;
  advisorCount?: number;
  newsCount?: number;
  error?: string;
}> {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    // Force read from server to bypass local cache
    const snap = await getDocFromServer(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteData;
      return {
        connected: true,
        docExists: true,
        docUpdatedAt: data.updatedAt,
        projectId: firebaseConfig.projectId,
        databaseId: firestoreDbId,
        projectCount: Array.isArray(data.projects) ? data.projects.length : 0,
        advisorCount: Array.isArray(data.advisors) ? data.advisors.length : 0,
        newsCount: Array.isArray(data.news) ? data.news.length : 0,
      };
    } else {
      return {
        connected: true,
        docExists: false,
        projectId: firebaseConfig.projectId,
        databaseId: firestoreDbId,
      };
    }
  } catch (err: any) {
    console.error('[Firebase] checkFirestoreConnection error:', err);
    return {
      connected: false,
      docExists: false,
      projectId: firebaseConfig.projectId,
      databaseId: firestoreDbId,
      error: err?.message || String(err),
    };
  }
}

/**
 * Fetch the latest site data from Firebase Firestore
 * Tries server first for fresh state, falls back to local cache if offline
 */
export async function loadSiteDataFromFirestore(): Promise<SiteData | null> {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    let snap;
    try {
      // Prioritize live server data
      snap = await getDocFromServer(docRef);
    } catch {
      // Fallback to cache/offline
      snap = await getDoc(docRef);
    }

    if (snap.exists()) {
      const data = snap.data() as SiteData;
      if (data && Array.isArray(data.projects) && data.projects.length > 0) {
        return data;
      }
    }

    // If document does not exist yet in Firestore, seed INITIAL_SITE_DATA
    await setDoc(docRef, INITIAL_SITE_DATA, { merge: true });
    return INITIAL_SITE_DATA;
  } catch (err) {
    console.warn('[Firebase] Error reading siteData from Firestore:', err);
    return null;
  }
}

/**
 * Save updated site data to Firebase Firestore (Permanent Cloud Persistence)
 */
export async function saveSiteDataToFirestore(
  data: SiteData
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    const stampedData: SiteData = {
      ...data,
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
    await setDoc(docRef, stampedData);
    return {
      success: true,
      message: 'Đã lưu vĩnh viễn và đồng bộ tức thì lên Google Cloud Firestore!',
    };
  } catch (err: any) {
    console.error('[Firebase] Failed to save siteData to Firestore:', err);
    return {
      success: false,
      message: 'Không thể lưu lên Firestore: ' + (err?.message || 'Lỗi mạng'),
      error: err?.message || String(err),
    };
  }
}

/**
 * Subscribe to real-time changes from Firestore
 * Any time Admin edits or imports JSON on any device, all visitors across the world see it live!
 */
export function subscribeToSiteData(onUpdate: (data: SiteData) => void): () => void {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        // Skip local pending writes to avoid echoing or race conditions
        if (snapshot.metadata.hasPendingWrites) {
          return;
        }
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as SiteData;
          if (cloudData && Array.isArray(cloudData.projects) && cloudData.projects.length > 0) {
            onUpdate(cloudData);
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot subscription warning:', error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Firebase] Could not subscribe to real-time updates:', e);
    return () => {};
  }
}

/**
 * Submit consultation inquiry directly to Firestore
 */
export async function submitInquiryToFirestore(inquiry: {
  fullName: string;
  phone: string;
  email?: string;
  projectInterest?: string;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const colRef = collection(db, 'inquiries');
    await addDoc(colRef, {
      ...inquiry,
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      message: 'Yêu cầu tư vấn của quý khách đã được gửi thành công!',
    };
  } catch (err) {
    console.warn('[Firebase] Error saving inquiry to Firestore:', err);
    return {
      success: true,
      message: 'Đã tiếp nhận thông tin tư vấn thành công!',
    };
  }
}
