const DB_NAME = "dba-profile-assets";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const BANNER_VIDEO_KEY = "profile-banner-video";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onerror = () => reject(request.error ?? new Error("Unable to open profile asset database."));
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveProfileBannerVideo(blob: Blob) {
  const db = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(blob, BANNER_VIDEO_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Unable to save banner video."));
  });
}

export async function loadProfileBannerVideo() {
  const db = await openDatabase();

  return await new Promise<Blob | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(BANNER_VIDEO_KEY);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result instanceof Blob ? result : null);
    };
    request.onerror = () => reject(request.error ?? new Error("Unable to load banner video."));
  });
}

export function getProfileBannerVideoKey() {
  return BANNER_VIDEO_KEY;
}
