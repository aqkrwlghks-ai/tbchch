const DB_NAME = 'tbchch_file_db';
const STORE_NAME = 'files';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export function saveFileToDB(postId: string, fileName: string, dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    initDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const key = `${postId}_${fileName}`;
        const request = store.put(dataUrl, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
      .catch(reject);
  });
}

export function getFileFromDB(postId: string, fileName: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    initDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const key = `${postId}_${fileName}`;
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      })
      .catch(reject);
  });
}

export function deleteFilesForPost(postId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    initDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openKeyCursor();

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const key = cursor.key as string;
            if (key.startsWith(`${postId}_`)) {
              store.delete(key);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      })
      .catch(reject);
  });
}
