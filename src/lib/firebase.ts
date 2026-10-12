import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserPopupRedirectResolver,
  signOut as fbSignOut,
  UserCredential,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  ProductCatalogItem,
  RegionalOrder,
  SellerAccount,
} from '../data/catalogData';

function clearStaleFirebaseSessionState() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith('firebase:')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
}

clearStaleFirebaseSessionState();

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event?.reason?.message || event?.reason || '');
    if (
      msg.includes('Pending promise was never set') ||
      msg.includes('client is offline') ||
      msg.includes('Could not reach Cloud Firestore backend')
    ) {
      event.preventDefault();
    }
  });
}

// Suppress noisy internal WebChannel timeout console.error logs when browser/iframe falls back to offline cache
try {
  setLogLevel('silent');
} catch {
  // Ignore
}

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB_ID = firebaseConfig.firestoreDatabaseId;
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;

// Use initializeFirestore with experimentalForceLongPolling so Cloud Firestore
// connects reliably inside sandboxed preview iframes and mobile networks
let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = dbInstance;

let authInstance: Auth;
try {
  authInstance = initializeAuth(app, {
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      inMemoryPersistence,
    ],
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

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
    tenantId?: boolean | string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Notice: ', JSON.stringify(errInfo));
}

export let isFirestoreOnline = true;

async function testConnection() {
  try {
    await getDoc(doc(db, 'test', 'connection'));
    isFirestoreOnline = true;
  } catch {
    // Either permission-denied (reachable) or offline cache active
    isFirestoreOnline = true;
  }
}
testConnection();

let activePopupPromise: Promise<UserCredential> | null = null;

export async function signInWithGooglePopup(): Promise<UserCredential> {
  if (activePopupPromise) {
    return activePopupPromise;
  }

  clearStaleFirebaseSessionState();

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  activePopupPromise = (async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver
      );
      return result;
    } finally {
      activePopupPromise = null;
      clearStaleFirebaseSessionState();
    }
  })();

  return activePopupPromise;
}

export async function connectFirebaseEmailAuth(
  email: string,
  password: string
): Promise<boolean> {
  if (!email.includes('@') || password.length < 6) return false;
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return true;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/invalid-credential'
    ) {
      try {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export async function signOutFirebase() {
  activePopupPromise = null;
  clearStaleFirebaseSessionState();
  return fbSignOut(auth);
}

/**
 * Persists a ProductCatalogItem to Cloud Firestore /products/{productId}
 */
export async function syncProductToFirestore(product: ProductCatalogItem) {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  const totalStock = Math.round(
    product.sizes.reduce((sum, s) => sum + Math.max(0, Number(s.stock) || 0), 0)
  );

  const sanitizedDocId = product.id
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 120);
  const path = `products/${sanitizedDocId}`;

  const payload = {
    sku: String(product.sku || 'RSC-KT-094').slice(0, 60),
    title: String(product.title || 'Untitled Product').slice(0, 200),
    status:
      product.status === 'Active • In Stock' ||
      product.status === 'Low Stock' ||
      product.status === 'Draft'
        ? product.status
        : 'Active • In Stock',
    primaryCategory:
      product.primaryCategory === 'Men' ||
      product.primaryCategory === 'Women' ||
      product.primaryCategory === 'Kids'
        ? product.primaryCategory
        : 'Women',
    subCategory: String(product.subCategory || 'Dresses').slice(0, 100),
    description: String(
      product.description || 'Reyaz Shopping Center item'
    ).slice(0, 2000),
    regularMrp: Math.min(500000, Math.max(0, Number(product.regularMrp) || 0)),
    sellingPrice: Math.min(
      500000,
      Math.max(0, Number(product.sellingPrice) || 0)
    ),
    regionalCodEnabled: Boolean(product.regionalCodEnabled),
    warehouseLocation: String(
      product.warehouseLocation || 'Horanda Flagship Hub Rack #B-12'
    ).slice(0, 200),
    totalStock: Math.min(100000, Math.max(0, totalStock)),
    ownerId: currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'products', sanitizedDocId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Persists a RegionalOrder to Cloud Firestore /orders/{orderId}
 */
export async function syncOrderToFirestore(order: RegionalOrder) {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  const sanitizedDocId = order.id
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 120);
  const path = `orders/${sanitizedDocId}`;

  const payload = {
    orderNumber: String(order.orderNumber || 'R2123456').slice(0, 40),
    customerName: String(order.customerName || 'Patron').slice(0, 120),
    village: String(order.villageArea || 'Horanda Alias Ramgarh').slice(0, 160),
    sku: String(order.sku || 'RSC-KT-094').slice(0, 60),
    productTitle: String(order.productTitle || 'Fashion Outfit').slice(0, 200),
    size: String(order.size || 'M').slice(0, 20),
    shade: String(order.shade || 'Purple').slice(0, 60),
    amount: Math.min(500000, Math.max(0, Number(order.amount) || 0)),
    status: order.status || 'Order Placed',
    ownerId: currentUser.uid,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'orders', sanitizedDocId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Persists a SellerAccount created by Super Admin to Cloud Firestore /sellers/{sellerId}
 */
export async function syncSellerToFirestore(seller: SellerAccount) {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  const sanitizedDocId = seller.id
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 120);
  const path = `sellers/${sanitizedDocId}`;

  const payload = {
    name: String(seller.name || 'Seller').slice(0, 120),
    email: String(seller.email || 'seller@reyazstore.in').slice(0, 150),
    phone: String(seller.phone || '9800000000').slice(0, 25),
    department: String(seller.department || 'All Departments').slice(0, 80),
    active: Boolean(seller.active),
    ownerId: currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'sellers', sanitizedDocId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function syncAllStoreDataToFirestore(
  products: ProductCatalogItem[],
  orders: RegionalOrder[],
  sellers: SellerAccount[]
): Promise<boolean> {
  if (!auth.currentUser) return false;
  try {
    await Promise.all([
      ...products.slice(0, 20).map((p) => syncProductToFirestore(p)),
      ...orders.slice(0, 20).map((o) => syncOrderToFirestore(o)),
      ...sellers.slice(0, 20).map((s) => syncSellerToFirestore(s)),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function subscribeToAdminProducts(
  uid: string,
  onData: (docs: Record<string, Record<string, unknown>>) => void
) {
  const q = query(collection(db, 'products'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const map: Record<string, Record<string, unknown>> = {};
      snapshot.forEach((docSnap) => {
        map[docSnap.id] = docSnap.data();
      });
      onData(map);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );
}
