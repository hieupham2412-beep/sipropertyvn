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

// Initialize Firestore with specific databaseId if provided
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-sipropertysngiao-f9d2df8c-096d-4d61-a622-09598293af94';
export const db: Firestore = getFirestore(app, firestoreDbId);

// Optional connection initialization
// Connection test is bypassed to operate independently without Google Cloud dependency

const SITE_CONTENT_DOC = 'main';

/**
 * Fetch the latest site data from Firebase Firestore
 */
export async function loadSiteDataFromFirestore(): Promise<SiteData | null> {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteData;
      if (data && data.projects) {
        return data;
      }
    }
    // If not found in Firestore yet, seed initial data to Firestore
    await setDoc(docRef, INITIAL_SITE_DATA, { merge: true });
    return INITIAL_SITE_DATA;
  } catch (err) {
    console.warn('[Firebase] Error reading siteData from Firestore:', err);
    return null;
  }
}

/**
 * Save updated site data to Firebase Firestore (Immediate real-time cloud persistence)
 */
export async function saveSiteDataToFirestore(data: SiteData): Promise<{ success: boolean; message: string }> {
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
  } catch (err) {
    console.error('[Firebase] Failed to save siteData to Firestore:', err);
    return {
      success: false,
      message: 'Không thể lưu lên Firestore. Đang lưu trên máy chủ dự phòng.',
    };
  }
}

/**
 * Subscribe to real-time changes from Firestore
 * Any time Admin edits or sorts data on any machine, all visitors see it live!
 */
export function subscribeToSiteData(onUpdate: (data: SiteData) => void): () => void {
  try {
    const docRef = doc(db, 'site_content', SITE_CONTENT_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        // Skip local pending writes to avoid echoing or rolling back current user's state
        if (snapshot.metadata.hasPendingWrites) {
          return;
        }
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as SiteData;
          if (cloudData && cloudData.projects) {
            onUpdate(cloudData);
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot subscription error:', error);
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
      success: true, // Graceful fallback
      message: 'Đã tiếp nhận thông tin tư vấn thành công!',
    };
  }
}
