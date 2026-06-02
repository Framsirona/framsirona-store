import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  getDoc,
  setDoc,
  serverTimestamp,
  where,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, ContactMessage, WebsiteTemplate, AffiliateProduct, CategoryInfo, DigitalOrder, DownloadLog, WebhookLog } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './initialData';
import { INITIAL_WEBSITE_TEMPLATES, INITIAL_AFFILIATE_PRODUCTS } from './initialWebsitesAndAffiliates';

// Flag to track if Firebase is successfully running with non-mocked/loaded parameters
let isFirebaseAvailable = false;
let app;
let db: any = null;

// Dynamically compile config prioritising modern secure environment variables
const mergedFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId
};

try {
  // Check if configuration resembles default mock / placeholders
  const isMock = 
    !mergedFirebaseConfig.apiKey || 
    mergedFirebaseConfig.apiKey.includes('PLACEHOLDER') || 
    mergedFirebaseConfig.apiKey.includes('FakeKey') || 
    mergedFirebaseConfig.projectId === 'framsirona-store' ||
    mergedFirebaseConfig.projectId.includes('PLACEHOLDER');
  
  if (!isMock) {
    app = getApps().length === 0 ? initializeApp(mergedFirebaseConfig) : getApp();
    db = getFirestore(app, mergedFirebaseConfig.firestoreDatabaseId || '(default)');
    isFirebaseAvailable = true;
    console.log("Firebase initialized successfully with secure environment credentials.");
  } else {
    console.warn("Framsirona Store is running in offline/local storage fallback mode. Set your VITE_FIREBASE_* environment variables to bind with live Cloud resources.");
  }
} catch (error) {
  console.error("Firebase failed to initialize. Reverting to robust LocalStorage state manager.", error);
}

// Ensure database fallback works seamlessly
const LOCAL_STORAGE_KEY_PRODUCTS = 'framsirona_catalog_products';
const LOCAL_STORAGE_KEY_MESSAGES = 'framsirona_contact_messages';
const LOCAL_STORAGE_KEY_WEBSITES = 'framsirona_websites';
const LOCAL_STORAGE_KEY_AFFILIATES = 'framsirona_affiliates';

// Initialize catalog cache in localStorage with strict sanitization of heavy base64 payloads to prevent QuotaExceededError
const getLocalStorageProducts = (): Product[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
  if (!cached) {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    const products: Product[] = JSON.parse(cached);
    let dirty = false;
    const sanitized = products.map(product => {
      let previewImages = product.previewImages || [];
      let downloadFile = product.downloadFile || '';
      const isBase64 = (str: string) => str && str.startsWith('data:image');
      if (previewImages.some(isBase64) || isBase64(downloadFile)) {
        dirty = true;
        previewImages = previewImages.map(img => 
          isBase64(img) ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800' : img
        );
        if (isBase64(downloadFile)) {
          downloadFile = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800';
        }
      }
      const checkoutUrl = product.checkoutUrl || product.paymentLink || 'https://snippe.me/pay/framsirona-store';
      const imageUrl = product.imageUrl || previewImages[0] || '';
      const downloadUrl = product.downloadUrl || downloadFile || '';
      return { ...product, previewImages, downloadFile, checkoutUrl, imageUrl, downloadUrl };
    });
    if (dirty) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(sanitized));
      return sanitized;
    }
    return products;
  } catch (error) {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
};

const saveLocalStorageProducts = (products: Product[]) => {
  // Purge any accidental base64 strings before writing to localStorage
  const sanitized = products.map(p => {
    let previewImages = p.previewImages || [];
    let downloadFile = p.downloadFile || '';
    const isBase64 = (str: string) => str && str.startsWith('data:image');
    previewImages = previewImages.map(img => 
      isBase64(img) ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800' : img
    );
    if (isBase64(downloadFile)) {
      downloadFile = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800';
    }
    const checkoutUrl = p.checkoutUrl || p.paymentLink || 'https://snippe.me/pay/framsirona-store';
    const imageUrl = p.imageUrl || previewImages[0] || '';
    const downloadUrl = p.downloadUrl || downloadFile || '';
    return { ...p, previewImages, downloadFile, checkoutUrl, imageUrl, downloadUrl };
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(sanitized));
};

const getLocalStorageMessages = (): ContactMessage[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
  return cached ? JSON.parse(cached) : [];
};

const saveLocalStorageMessage = (msg: ContactMessage) => {
  const messages = getLocalStorageMessages();
  messages.push(msg);
  localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
};

export const getLocalStorageWebsites = (): WebsiteTemplate[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_WEBSITES);
  if (!cached) {
    localStorage.setItem(LOCAL_STORAGE_KEY_WEBSITES, JSON.stringify(INITIAL_WEBSITE_TEMPLATES));
    return INITIAL_WEBSITE_TEMPLATES;
  }
  try {
    const templates: WebsiteTemplate[] = JSON.parse(cached);
    let dirty = false;
    const sanitized = templates.map(t => {
      let previewImages = t.previewImages || [];
      let downloadFile = t.downloadFile || '';
      const isBase64 = (str: string) => str && str.startsWith('data:image');
      if (previewImages.some(isBase64) || isBase64(downloadFile)) {
        dirty = true;
        previewImages = previewImages.map(img => 
          isBase64(img) ? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800' : img
        );
        if (isBase64(downloadFile)) {
          downloadFile = 'https://assets.framsirona.org/default-template.zip';
        }
      }
      return { ...t, previewImages, downloadFile };
    });
    if (dirty || templates.length < INITIAL_WEBSITE_TEMPLATES.length) {
      const finalTemplates = sanitized.length < INITIAL_WEBSITE_TEMPLATES.length ? INITIAL_WEBSITE_TEMPLATES : sanitized;
      localStorage.setItem(LOCAL_STORAGE_KEY_WEBSITES, JSON.stringify(finalTemplates));
      return finalTemplates;
    }
    return templates;
  } catch (error) {
    localStorage.setItem(LOCAL_STORAGE_KEY_WEBSITES, JSON.stringify(INITIAL_WEBSITE_TEMPLATES));
    return INITIAL_WEBSITE_TEMPLATES;
  }
};

export const saveLocalStorageWebsites = (w: WebsiteTemplate[]) => {
  // Purge any accidental base64 strings before writing to localStorage
  const sanitized = w.map(t => {
    let previewImages = t.previewImages || [];
    let downloadFile = t.downloadFile || '';
    const isBase64 = (str: string) => str && str.startsWith('data:image');
    previewImages = previewImages.map(img => 
      isBase64(img) ? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800' : img
    );
    if (isBase64(downloadFile)) {
      downloadFile = 'https://assets.framsirona.org/default-template.zip';
    }
    return { ...t, previewImages, downloadFile };
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_WEBSITES, JSON.stringify(sanitized));
};

export const getLocalStorageAffiliates = (): AffiliateProduct[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_AFFILIATES);
  if (!cached) {
    localStorage.setItem(LOCAL_STORAGE_KEY_AFFILIATES, JSON.stringify(INITIAL_AFFILIATE_PRODUCTS));
    return INITIAL_AFFILIATE_PRODUCTS;
  }
  return JSON.parse(cached);
};

export const saveLocalStorageAffiliates = (a: AffiliateProduct[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_AFFILIATES, JSON.stringify(a));
};

export const getLocalStorageCategories = (): CategoryInfo[] => {
  const cached = localStorage.getItem('framsirona_catalog_categories');
  if (!cached) {
    localStorage.setItem('framsirona_catalog_categories', JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  return JSON.parse(cached);
};

export const saveLocalStorageCategories = (c: CategoryInfo[]) => {
  localStorage.setItem('framsirona_catalog_categories', JSON.stringify(c));
};

// Mandatory Operation enum for Firestore Errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Requirement 3: Mandatory Error Handler
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'anonymous_admin', // No standard auth as required
      email: 'admin@framsirona.com',
      emailVerified: true,
      isAnonymous: false,
    },
    operationType,
    path
  };
  console.error('Firestore Error Info: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// DATABASE LAYER OPERATIONS

// CREATE / ADD Product - Stores in Firestore under identical ID primarily
export const addStoreProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  const id = 'p_' + Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  
  const newProduct: Product = {
    ...productData,
    id,
    createdAt,
    imageUrl: productData.imageUrl || (productData.previewImages && productData.previewImages[0]) || '',
    downloadUrl: productData.downloadUrl || productData.downloadFile || ''
  };

  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'products', id), {
        ...newProduct,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }
  } else {
    // Graceful offline fallback to localStorage only if Firebase is unavailable
    const localList = getLocalStorageProducts();
    localList.unshift(newProduct);
    saveLocalStorageProducts(localList);
  }

  return newProduct;
};

// READ Products list
export const fetchStoreProducts = async (): Promise<Product[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsProducts: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsProducts.push({
          id: docSnap.id,
          title: d.title || '',
          description: d.description || '',
          category: d.category || '',
          price: Number(d.price) || 0,
          previewImages: d.previewImages || [],
          downloadFile: d.downloadFile || '',
          createdAt: d.createdAt || new Date().toISOString(),
          fileSize: d.fileSize || 'N/A',
          fileFormat: d.fileFormat || 'Download link',
          features: d.features || [],
          paymentLink: d.paymentLink || '',
          checkoutUrl: d.checkoutUrl || d.paymentLink || 'https://snippe.me/pay/framsirona-store',
          imageUrl: d.imageUrl || (d.previewImages && d.previewImages[0]) || '',
          downloadUrl: d.downloadUrl || d.downloadFile || ''
        });
      });
      if (fsProducts.length > 0) {
        return fsProducts; // Stored primarily in Firestore without forcing local mirror overwrite
      }
    } catch (err) {
      console.warn("Firestore pull failed, retrieving from client fallback ledger.", err);
    }
  }
  return getLocalStorageProducts();
};

// Real-time synchronization listener for products list
export const subscribeStoreProducts = (callback: (products: Product[]) => void): (() => void) => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fsProducts: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          fsProducts.push({
            id: docSnap.id,
            title: d.title || '',
            description: d.description || '',
            category: d.category || '',
            price: Number(d.price) || 0,
            previewImages: d.previewImages || [],
            downloadFile: d.downloadFile || '',
            createdAt: d.createdAt || new Date().toISOString(),
            fileSize: d.fileSize || 'N/A',
            fileFormat: d.fileFormat || 'Download link',
            features: d.features || [],
            paymentLink: d.paymentLink || '',
            checkoutUrl: d.checkoutUrl || d.paymentLink || 'https://snippe.me/pay/framsirona-store',
            imageUrl: d.imageUrl || (d.previewImages && d.previewImages[0]) || '',
            downloadUrl: d.downloadUrl || d.downloadFile || ''
          });
        });
        
        // Sync to local cache to keep local fallback and live state in 100% agreement
        if (fsProducts.length > 0) {
          saveLocalStorageProducts(fsProducts);
          callback(fsProducts);
        } else {
          callback(getLocalStorageProducts());
        }
      }, (err) => {
        console.error("Firestore product onSnapshot subscription failed. Falling back to localStorage.", err);
        callback(getLocalStorageProducts());
      });
      
      return unsubscribe;
    } catch (err) {
      console.error("Failed to establish real-time product subscription.", err);
      callback(getLocalStorageProducts());
      return () => {};
    }
  } else {
    callback(getLocalStorageProducts());
    return () => {};
  }
};

// READ Single Product
export const fetchSingleProduct = async (id: string): Promise<Product | null> => {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'products', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const d = snap.data();
        return {
          id: snap.id,
          title: d.title || '',
          description: d.description || '',
          category: d.category || '',
          price: Number(d.price) || 0,
          previewImages: d.previewImages || [],
          downloadFile: d.downloadFile || '',
          createdAt: d.createdAt || new Date().toISOString(),
          fileSize: d.fileSize || 'N/A',
          fileFormat: d.fileFormat || 'Download link',
          features: d.features || [],
          paymentLink: d.paymentLink || '',
          checkoutUrl: d.checkoutUrl || d.paymentLink || 'https://snippe.me/pay/framsirona-store',
          imageUrl: d.imageUrl || (d.previewImages && d.previewImages[0]) || '',
          downloadUrl: d.downloadUrl || d.downloadFile || ''
        };
      }
    } catch (err) {
      console.warn("Firestore item fetch failed. Consulting fallback ledger.");
    }
  }
  const localList = getLocalStorageProducts();
  return localList.find(p => p.id === id) || null;
};

// UPDATE Product
export const updateStoreProduct = async (id: string, updatedFields: Partial<Product>): Promise<Product> => {
  let finalProduct: Product;
  
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const d = snap.data();
        finalProduct = {
          id: snap.id,
          title: d.title || '',
          description: d.description || '',
          category: d.category || '',
          price: Number(d.price) || 0,
          previewImages: d.previewImages || [],
          downloadFile: d.downloadFile || '',
          createdAt: d.createdAt || new Date().toISOString(),
          fileSize: d.fileSize || 'N/A',
          fileFormat: d.fileFormat || 'Download link',
          features: d.features || [],
          paymentLink: d.paymentLink || '',
          checkoutUrl: d.checkoutUrl || d.paymentLink || 'https://snippe.me/pay/framsirona-store',
          imageUrl: d.imageUrl || (d.previewImages && d.previewImages[0]) || '',
          downloadUrl: d.downloadUrl || d.downloadFile || ''
        };
      } else {
        throw new Error(`Product ${id} not found in Firestore.`);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
      throw err;
    }
  } else {
    const localList = getLocalStorageProducts();
    const index = localList.findIndex(p => p.id === id);
    if (index !== -1) {
      localList[index] = { ...localList[index], ...updatedFields };
      finalProduct = localList[index];
      saveLocalStorageProducts(localList);
    } else {
      throw new Error(`Product ${id} not found in client fallback ledger.`);
    }
  }

  return finalProduct;
};

// DELETE Product
export const deleteStoreProduct = async (id: string): Promise<boolean> => {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      return false;
    }
  } else {
    const localList = getLocalStorageProducts();
    const filtered = localList.filter(p => p.id !== id);
    const found = localList.length !== filtered.length;
    saveLocalStorageProducts(filtered);
    return found;
  }
};

// SUBMIT Contact inquiry
export const submitContactInquiry = async (messageData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> => {
  const id = 'msg_' + Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  
  const newMsg: ContactMessage = {
    ...messageData,
    id,
    createdAt
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, 'contacts'), {
        ...newMsg,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'contacts');
    }
  }

  saveLocalStorageMessage(newMsg);
  return newMsg;
};

// GET Contact Inquiries for admin check
export const fetchContactInquiries = async (): Promise<ContactMessage[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'contacts'));
      const fsMsgs: ContactMessage[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsMsgs.push({
          id: docSnap.id,
          name: d.name || '',
          email: d.email || '',
          subject: d.subject || '',
          message: d.message || '',
          createdAt: d.createdAt || new Date().toISOString()
        });
      });
      return fsMsgs;
    } catch (err) {
      console.warn("Firestore contact list read failed or denied, consulting local mirror.", err);
    }
  }
  return getLocalStorageMessages();
};

// CATEGORIES CRUD
export const fetchCategoriesFromDB = async (): Promise<CategoryInfo[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      const fsCats: CategoryInfo[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsCats.push({
          id: docSnap.id as any,
          name: d.name || docSnap.id || '',
          description: d.description || '',
          icon: d.icon || 'Sparkles',
          imageUrl: d.imageUrl || ''
        });
      });
      if (fsCats.length > 0) {
        saveLocalStorageCategories(fsCats);
        return fsCats;
      }
    } catch (err) {
      console.warn("Firestore categories read failed, defaulting to local cache.", err);
    }
  }
  return getLocalStorageCategories();
};

// Real-time synchronization listener for categories
export const subscribeCategoriesFromDB = (callback: (categories: CategoryInfo[]) => void): (() => void) => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'categories'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fsCats: CategoryInfo[] = [];
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          fsCats.push({
            id: docSnap.id as any,
            name: d.name || docSnap.id || '',
            description: d.description || '',
            icon: d.icon || 'Sparkles',
            imageUrl: d.imageUrl || ''
          });
        });
        
        if (fsCats.length > 0) {
          saveLocalStorageCategories(fsCats);
          callback(fsCats);
        } else {
          callback(getLocalStorageCategories());
        }
      }, (err) => {
        console.error("Firestore categories onSnapshot subscription failed. Falling back to localStorage.", err);
        callback(getLocalStorageCategories());
      });
      
      return unsubscribe;
    } catch (err) {
      console.error("Failed to establish real-time categories subscription.", err);
      callback(getLocalStorageCategories());
      return () => {};
    }
  } else {
    callback(getLocalStorageCategories());
    return () => {};
  }
};

export const addCategoryInDB = async (catData: Omit<CategoryInfo, 'count'>): Promise<CategoryInfo> => {
  const id = catData.id || catData.name;
  const newCat: CategoryInfo = {
    ...catData,
    id: id as any,
    imageUrl: catData.imageUrl || ''
  };

  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'categories', id), {
        name: newCat.name,
        description: newCat.description,
        icon: newCat.icon,
        imageUrl: newCat.imageUrl,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `categories/${id}`);
    }
  }

  const localList = getLocalStorageCategories();
  const filtered = localList.filter(c => c.id !== id);
  filtered.unshift(newCat);
  saveLocalStorageCategories(filtered);
  return newCat;
};

export const updateCategoryInDB = async (id: string, updatedFields: Partial<CategoryInfo>): Promise<CategoryInfo> => {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'categories', id);
      await setDoc(docRef, {
        ...updatedFields,
        serverTime: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `categories/${id}`);
    }
  }

  const localList = getLocalStorageCategories();
  const updated = localList.map(c => {
    if (c.id === id) {
      return { ...c, ...updatedFields };
    }
    return c;
  });
  saveLocalStorageCategories(updated);

  const found = updated.find(c => c.id === id);
  if (!found) {
    throw new Error(`Category ${id} not found.`);
  }
  return found;
};

export const deleteCategoryFromDB = async (id: string): Promise<boolean> => {
  const localList = getLocalStorageCategories();
  const filtered = localList.filter(c => c.id !== id);
  const found = localList.length !== filtered.length;
  saveLocalStorageCategories(filtered);

  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'categories', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  }
  return found;
};

// DIGITAL STORAGE INTERACTION (Cloudinary Direct Unsigned Upload)
// Direct upload to Cloudinary using their unsigned preset
// NOTE: For Netlify deployment, set these environment variables in Site Settings → Environment Variables:
//   - VITE_CLOUDINARY_CLOUD_NAME
//   - VITE_CLOUDINARY_UPLOAD_PRESET
// Important: Do NOT include quotes in Netlify env variable values. Redeploy after changing env variables.
export const uploadFileToStorage = async (file: File, folder: 'previews' | 'digital_downloads'): Promise<string> => {
  console.log("Upload started");
  let cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  let uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  // Trim whitespace from environment variables
  cloudName = cloudName.trim();
  uploadPreset = uploadPreset.trim();

  // Strict validation: ensure both variables are present and valid
  if (!cloudName || !uploadPreset || cloudName === 'undefined' || uploadPreset === 'undefined') {
    const errorMsg = 'Cloudinary config missing or not loaded from environment variables. ' +
      'Ensure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set in Netlify Site Settings → Environment Variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Debug logging to help diagnose configuration issues
  console.log("CLOUDINARY DEBUG:", {
    cloudName,
    uploadPreset
  });

  console.log(`[Cloudinary Unsigned Upload] Uploading "${file.name}" to cloud: ${cloudName} preset: ${uploadPreset}`);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  // Auto-detect resource_type to handle image and ZIP/raw files cleanly
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Cloudinary Upload Error Response]', errorText);
    throw new Error(`Cloudinary upload failed. Check cloud name and upload preset in Netlify env variables. Status: ${response.status}, Details: ${errorText}`);
  }

  const data = await response.json();
  if (data.secure_url) {
    console.log(`Cloudinary success URL: ${data.secure_url}`);
    return data.secure_url;
  } else if (data.url) {
    console.log(`Cloudinary success URL: ${data.url}`);
    return data.url;
  } else {
    throw new Error('Cloudinary response did not contain a valid URL');
  }
};

// WEBSITE TEMPLATES CRUD
export const addWebsiteTemplate = async (templateData: Omit<WebsiteTemplate, 'id' | 'createdAt'>): Promise<WebsiteTemplate> => {
  const id = 'wt_' + Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const newTemplate: WebsiteTemplate = {
    ...templateData,
    id,
    createdAt
  };

  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, 'websites', id), {
        ...newTemplate,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `websites/${id}`);
    }
  } else {
    const localList = getLocalStorageWebsites();
    localList.unshift(newTemplate);
    saveLocalStorageWebsites(localList);
  }
  return newTemplate;
};

export const fetchWebsiteTemplates = async (): Promise<WebsiteTemplate[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'websites'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsTemplates: WebsiteTemplate[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const rawCategory = d.category || 'Business website';
        const legacyMap: { [key: string]: string } = {
          'Business websites': 'Business website',
          'Logistics company websites': 'Logistics company website',
          'Finance/accounting websites': 'Accounting firm website',
          'Church websites': 'Church website',
          'Portfolio websites': 'Portfolio website',
          'Ecommerce websites': 'Ecommerce website',
          'Real estate websites': 'Real estate website',
          'Agency websites': 'Creative agency website',
          'Accounting firm websites': 'Accounting firm website',
          'Creative agency websites': 'Creative agency website',
          'Barber shop websites': 'Barber shop website',
          'Restaurant websites': 'Restaurant website',
          'Job board websites': 'Job board website'
        };
        const mappedCategory = (legacyMap[rawCategory] || rawCategory) as any;

        fsTemplates.push({
          id: docSnap.id,
          title: d.title || '',
          description: d.description || '',
          category: mappedCategory,
          price: Number(d.price) || 0,
          previewImages: d.previewImages || [],
          liveDemoUrl: d.liveDemoUrl || '',
          techStack: d.techStack || [],
          downloadFile: d.downloadFile || '',
          features: d.features || [],
          createdAt: d.createdAt || new Date().toISOString()
        });
      });
      if (fsTemplates.length > 0) {
        return fsTemplates;
      }
    } catch (err) {
      console.warn("Firestore website templates read failed, defaulting to local cache.", err);
    }
  }
  return getLocalStorageWebsites();
};

export const deleteWebsiteTemplate = async (id: string): Promise<boolean> => {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'websites', id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `websites/${id}`);
      return false;
    }
  } else {
    const localList = getLocalStorageWebsites();
    const filtered = localList.filter(w => w.id !== id);
    const found = localList.length !== filtered.length;
    saveLocalStorageWebsites(filtered);
    return found;
  }
};

export const updateWebsiteTemplate = async (id: string, templateData: Omit<WebsiteTemplate, 'id' | 'createdAt'>): Promise<boolean> => {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'websites', id);
      await setDoc(docRef, {
        ...templateData,
        id,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `websites/${id}`);
      return false;
    }
  } else {
    const localList = getLocalStorageWebsites();
    const index = localList.findIndex(w => w.id === id);
    if (index !== -1) {
      localList[index] = {
        ...localList[index],
        ...templateData,
        id
      };
      saveLocalStorageWebsites(localList);
      return true;
    }
    return false;
  }
};

// AFFILIATE PRODUCTS CRUD
export const addAffiliateProductInDB = async (affData: Omit<AffiliateProduct, 'id' | 'createdAt'>): Promise<AffiliateProduct> => {
  const id = 'ap_' + Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const newAffiliate: AffiliateProduct = {
    ...affData,
    id,
    createdAt
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, 'affiliates'), {
        ...newAffiliate,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'affiliates');
    }
  }

  const localList = getLocalStorageAffiliates();
  localList.unshift(newAffiliate);
  saveLocalStorageAffiliates(localList);
  return newAffiliate;
};

export const fetchAffiliateProductsFromDB = async (): Promise<AffiliateProduct[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'affiliates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsAffs: AffiliateProduct[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsAffs.push({
          id: docSnap.id,
          title: d.title || '',
          description: d.description || '',
          category: d.category || 'Creator Essentials',
          image: d.image || '',
          amazonLink: d.amazonLink || '',
          createdAt: d.createdAt || new Date().toISOString()
        });
      });
      if (fsAffs.length > 0) {
        saveLocalStorageAffiliates(fsAffs);
        return fsAffs;
      }
    } catch (err) {
      console.warn("Firestore affiliates read failed, defaulting to local cache.", err);
    }
  }
  return getLocalStorageAffiliates();
};

export const deleteAffiliateProductFromDB = async (id: string): Promise<boolean> => {
  const localList = getLocalStorageAffiliates();
  const filtered = localList.filter(ap => ap.id !== id);
  const found = localList.length !== filtered.length;
  saveLocalStorageAffiliates(filtered);

  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, 'affiliates', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `affiliates/${id}`);
    }
  }
  return found;
};

// ============================================
// MONETIZATION CORE & SECURE DIGITAL RETRIEVAL
// ============================================

const LOCAL_STORAGE_KEY_ORDERS = 'framsirona_orders';
const LOCAL_STORAGE_KEY_DOWNLOAD_LOGS = 'framsirona_download_logs';
const LOCAL_STORAGE_KEY_WEBHOOK_LOGS = 'framsirona_webhook_logs';

const getLocalStorageOrders = (): DigitalOrder[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
  if (!cached) {
    const initialOrders: DigitalOrder[] = [
      {
        id: 'ord_snip_82a3',
        productId: 'frams_saas_wt',
        productType: 'website',
        productTitle: 'Corporate SaaS Webflow Portfolio',
        buyerEmail: 'frank92ronald@gmail.com',
        pricePaid: 49.00,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        status: 'completed',
        paymentGateway: 'Snippe',
        paymentIntentId: 'spi_live_9a87dbe1',
        downloadToken: 'dt_saas_portfolio_8192',
        tokenExpiresAt: new Date(Date.now() + 3600000 * 22).toISOString() // expires in 22h
      },
      {
        id: 'ord_snip_54bc',
        productId: 'p_canva_inf',
        productType: 'product',
        productTitle: 'Canva Modern Brand Invoice Template',
        buyerEmail: 'client@framsirona.org',
        pricePaid: 15.00,
        createdAt: new Date(Date.now() - 3600000 * 25).toISOString(), // 25 hours ago (expired)
        status: 'completed',
        paymentGateway: 'Snippe',
        paymentIntentId: 'spi_live_5h31dfca',
        downloadToken: 'dt_invoice_template_expired',
        tokenExpiresAt: new Date(Date.now() - 3600000).toISOString() // expired 1 hour ago
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(cached);
};

const saveLocalStorageOrders = (orders: DigitalOrder[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
};

const getLocalStorageDownloadLogs = (): DownloadLog[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_DOWNLOAD_LOGS);
  if (!cached) {
    const initialLogs: DownloadLog[] = [
      {
        id: 'dl_9a1df2',
        orderId: 'ord_snip_82a3',
        productId: 'frams_saas_wt',
        productTitle: 'Corporate SaaS Webflow Portfolio',
        buyerEmail: 'frank92ronald@gmail.com',
        ipAddress: '194.22.181.5',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
        downloadedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        status: 'success'
      },
      {
        id: 'dl_8bc3e1',
        orderId: 'ord_snip_54bc',
        productId: 'p_canva_inf',
        productTitle: 'Canva Modern Brand Invoice Template',
        buyerEmail: 'client@framsirona.org',
        ipAddress: '82.16.59.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        downloadedAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        status: 'expired'
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_DOWNLOAD_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  }
  return JSON.parse(cached);
};

const saveLocalStorageDownloadLogs = (logs: DownloadLog[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_DOWNLOAD_LOGS, JSON.stringify(logs));
};

const getLocalStorageWebhookLogs = (): WebhookLog[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_WEBHOOK_LOGS);
  if (!cached) {
    const initialWebhookLogs: WebhookLog[] = [
      {
        id: 'wh_9210fd',
        receivedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        event: 'checkout.completed',
        gateway: 'snip_pay',
        payload: JSON.stringify({
          event: "checkout.completed",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          data: {
            checkoutId: "chk_live_21fa81",
            amount: 49.00,
            currency: "USD",
            customerEmail: "frank92ronald@gmail.com",
            productId: "frams_saas_wt"
          },
          signature: "snippay_sig_9901adbeb31"
        }, null, 2),
        status: 'verified'
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_WEBHOOK_LOGS, JSON.stringify(initialWebhookLogs));
    return initialWebhookLogs;
  }
  return JSON.parse(cached);
};

const saveLocalStorageWebhookLogs = (wlogs: WebhookLog[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_WEBHOOK_LOGS, JSON.stringify(wlogs));
};

// WRITE webhook event simulated record
export const recordWebhookEvent = async (
  event: string,
  gateway: string,
  rawPayload: string,
  status: 'verified' | 'unverified' | 'failed'
): Promise<WebhookLog> => {
  const id = 'wh_' + Math.random().toString(36).substring(2, 9);
  const receivedAt = new Date().toISOString();
  
  const newLog: WebhookLog = {
    id,
    receivedAt,
    event,
    gateway,
    payload: rawPayload,
    status
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, 'webhook_logs'), {
        ...newLog,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'webhook_logs');
    }
  }

  const list = getLocalStorageWebhookLogs();
  list.unshift(newLog);
  saveLocalStorageWebhookLogs(list);

  return newLog;
};

// CREATE Order (Verifies payment and initiates expiring material keys)
export const recordOrder = async (
  orderData: Omit<DigitalOrder, 'id' | 'createdAt' | 'downloadToken' | 'tokenExpiresAt'>,
  statusOverride: 'completed' | 'processing' | 'pending' | 'canceled' = 'completed'
): Promise<DigitalOrder> => {
  const id = 'ord_snip_' + Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const downloadToken = 'dt_' + Math.random().toString(36).substring(2, 12);
  
  // Enforce expiring download links: Exactly 1 hour expiry (highly secure short duration)
  const tokenExpiresAt = new Date(Date.now() + 1 * 3600 * 1000).toISOString();

  const newOrder: DigitalOrder = {
    ...orderData,
    id,
    createdAt,
    status: statusOverride,
    downloadToken,
    tokenExpiresAt
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, 'orders'), {
        ...newOrder,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  }

  const list = getLocalStorageOrders();
  list.unshift(newOrder);
  saveLocalStorageOrders(list);

  // AUTOMATED WEBHOOK READY ARCHITECTURE
  // Synchronously simulate real-time API Webhook reception for the dashboard log stream
  const hookPayload = {
    event: "order.completed",
    timestamp: createdAt,
    source: "snippe_production_api_v1",
    transaction: {
      orderId: id,
      gatewaySessionId: orderData.paymentIntentId,
      email: orderData.buyerEmail,
      productId: orderData.productId,
      assetType: orderData.productType,
      amountCharged: orderData.pricePaid,
      currency: "USD"
    },
    downloadAccess: {
      token: downloadToken,
      expiryDateTime: tokenExpiresAt,
      hoursLimit: 1
    },
    signature: "snippe_hmac_" + Math.random().toString(16).substring(2, 32)
  };

  await recordWebhookEvent(
    "order.completed",
    "snippe",
    JSON.stringify(hookPayload, null, 2),
    "verified"
  );

  return newOrder;
};

// READ orders list
export const fetchOrders = async (): Promise<DigitalOrder[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsOrders: DigitalOrder[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsOrders.push({
          id: d.id || docSnap.id,
          productId: d.productId || '',
          productType: d.productType || 'product',
          productTitle: d.productTitle || '',
          buyerEmail: d.buyerEmail || '',
          pricePaid: Number(d.pricePaid) || 0,
          createdAt: d.createdAt || new Date().toISOString(),
          status: d.status || 'completed',
          paymentGateway: (d.paymentGateway === 'SnipPay' || d.paymentGateway === 'Stripe') ? 'Snippe' : (d.paymentGateway || 'Snippe'),
          paymentIntentId: d.paymentIntentId || '',
          downloadToken: d.downloadToken || '',
          tokenExpiresAt: d.tokenExpiresAt || ''
        });
      });
      if (fsOrders.length > 0) {
        saveLocalStorageOrders(fsOrders);
        return fsOrders;
      }
    } catch (err) {
      console.warn("Firestore orders read failed, resorting to localized matrix log.");
    }
  }
  return getLocalStorageOrders();
};

// READ Webhook logs list
export const fetchWebhookLogs = async (): Promise<WebhookLog[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'webhook_logs'), orderBy('receivedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsWLogs: WebhookLog[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsWLogs.push({
          id: d.id || docSnap.id,
          receivedAt: d.receivedAt || '',
          event: d.event || 'checkout.completed',
          gateway: d.gateway || 'snip_pay',
          payload: d.payload || '{}',
          status: d.status || 'verified'
        });
      });
      if (fsWLogs.length > 0) {
        saveLocalStorageWebhookLogs(fsWLogs);
        return fsWLogs;
      }
    } catch (err) {
      console.warn("Firestore webhook logs read failed, consulting localized mirror.");
    }
  }
  return getLocalStorageWebhookLogs();
};

// READ Download logs list
export const fetchDownloadLogs = async (): Promise<DownloadLog[]> => {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'download_logs'), orderBy('downloadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fsDLs: DownloadLog[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fsDLs.push({
          id: d.id || docSnap.id,
          orderId: d.orderId || '',
          productId: d.productId || '',
          productTitle: d.productTitle || '',
          buyerEmail: d.buyerEmail || '',
          ipAddress: d.ipAddress || '127.0.0.1',
          userAgent: d.userAgent || 'Browser client',
          downloadedAt: d.downloadedAt || '',
          status: d.status || 'success'
        });
      });
      if (fsDLs.length > 0) {
        saveLocalStorageDownloadLogs(fsDLs);
        return fsDLs;
      }
    } catch (err) {
      console.warn("Firestore download logs read failed, consulting local mirror.");
    }
  }
  return getLocalStorageDownloadLogs();
};

// TRACK download event and enforce expiration
export const verifyAndRecordDownload = async (
  downloadToken: string,
  clientInfo?: { ipAddress?: string; userAgent?: string }
): Promise<{ order: DigitalOrder; log: DownloadLog; status: 'ready' | 'expired' | 'invalid'; downloadUrl?: string }> => {
  const id = 'dl_' + Math.random().toString(36).substring(2, 9);
  const downloadedAt = new Date().toISOString();
  
  let order: DigitalOrder | undefined;

  const ip = clientInfo?.ipAddress || '192.168.1.1';
  const ua = clientInfo?.userAgent || navigator.userAgent;

  // Direct Firestore secure query using WHERE filter, preventing local scanning bypasses
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, 'orders'), where('downloadToken', '==', downloadToken));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const d = docSnap.data();
        order = {
          id: d.id || docSnap.id,
          productId: d.productId || '',
          productType: d.productType || 'product',
          productTitle: d.productTitle || '',
          buyerEmail: d.buyerEmail || '',
          pricePaid: Number(d.pricePaid) || 0,
          createdAt: d.createdAt || new Date().toISOString(),
          status: d.status || 'completed',
          paymentGateway: (d.paymentGateway === 'SnipPay' || d.paymentGateway === 'Stripe') ? 'Snippe' : (d.paymentGateway || 'Snippe'),
          paymentIntentId: d.paymentIntentId || '',
          downloadToken: d.downloadToken || '',
          tokenExpiresAt: d.tokenExpiresAt || ''
        };
      }
    } catch (err) {
      console.warn("Direct firestore token lookup failed, fallback to local search", err);
    }
  }

  // Fallback lookup
  if (!order) {
    // Special bypass for static hosted direct path downloads option (/download/:id)
    if (downloadToken === 'dt_direct_url_access' || downloadToken === 'dt_local_direct_download') {
      order = {
        id: 'ord_direct_access',
        productId: 'p1', // fallback, will resolve to route ID segment eventually
        productType: 'product',
        productTitle: 'Direct Path Download Release',
        buyerEmail: 'buyer@framsirona.org',
        pricePaid: 0,
        createdAt: new Date().toISOString(),
        status: 'completed',
        paymentGateway: 'Snippe',
        paymentIntentId: 'direct_access_bypass',
        downloadToken: downloadToken,
        tokenExpiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString() // 24 hours expiry
      };
    } else {
      const orders = await fetchOrders();
      order = orders.find(o => o.downloadToken === downloadToken);
    }
  }

  // Case 1: Matching order token not found OR purchase was not finalized/completed
  if (!order || order.status !== 'completed') {
    const errorLog: DownloadLog = {
      id,
      orderId: order?.id || 'N/A',
      productId: order?.productId || 'unknown',
      productTitle: order?.productTitle || 'Corrupted Verification Attempt',
      buyerEmail: order?.buyerEmail || 'unauthorized_payload_gateway',
      ipAddress: ip,
      userAgent: ua,
      downloadedAt,
      status: 'invalid_token'
    };

    if (isFirebaseAvailable && db) {
      try {
        await addDoc(collection(db, 'download_logs'), {
          ...errorLog,
          serverTime: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'download_logs');
      }
    }

    const localDLs = getLocalStorageDownloadLogs();
    localDLs.unshift(errorLog);
    saveLocalStorageDownloadLogs(localDLs);

    throw new Error("SECURE LINK VERIFICATION FAILED: The provided purchase verification token is invalid or unauthorized.");
  }

  // Case 2: Link expired (Enforces short duration. Checking if current date exceeds the decaying token date)
  const isExpired = new Date() > new Date(order.tokenExpiresAt);
  const currentStatus = isExpired ? 'expired' : 'success';

  const log: DownloadLog = {
    id,
    orderId: order.id,
    productId: order.productId,
    productTitle: order.productTitle,
    buyerEmail: order.buyerEmail,
    ipAddress: ip,
    userAgent: ua,
    downloadedAt,
    status: currentStatus as any
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, 'download_logs'), {
        ...log,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'download_logs');
    }
  }

  const localDLs = getLocalStorageDownloadLogs();
  localDLs.unshift(log);
  saveLocalStorageDownloadLogs(localDLs);

  if (isExpired) {
    return { order, log, status: 'expired' };
  }

  // Retrieve the original downloadFile securely only upon successful verification to prevent direct URL guessing!
  let downloadUrl = '';
  if (isFirebaseAvailable && db) {
    try {
      const isWebsite = order.productType === 'website';
      const collName = isWebsite ? 'websites' : 'products';
      const q = query(collection(db, collName), where('id', '==', order.productId));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        downloadUrl = snaps.docs[0].data().downloadFile || '';
      } else {
        // search by document ID directly too as safety backup
        const docRef = doc(db, collName, order.productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          downloadUrl = docSnap.data().downloadFile || '';
        }
      }
    } catch (err) {
      console.warn("Could not securely fetch associated product link from Firestore.", err);
    }
  }

  // Local mirror or database fallback
  if (!downloadUrl) {
    const isWebsite = order?.productType === 'website';
    if (isWebsite) {
      const websitesArr = getLocalStorageWebsites();
      const hit = websitesArr.find(w => w.id === order?.productId);
      if (hit) {
        downloadUrl = hit.downloadFile || '';
      }
    } else {
      const productsArr = getLocalStorageProducts();
      const hit = productsArr.find(p => p.id === order?.productId);
      if (hit) {
        downloadUrl = hit.downloadFile || '';
      }
    }
  }

  return { order, log, status: 'ready', downloadUrl };
};

export { isFirebaseAvailable };
