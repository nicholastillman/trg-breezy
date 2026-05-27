import type { AtmosphericSession } from '@/types/atmosphere'

// Using the `idb` package for a clean promise-based API over raw IndexedDB.
// Install: npm install idb

const DB_NAME = 'breezy-atmosphere'
const DB_VERSION = 1
const STORE = 'atmospheric-sessions'

// Lazy singleton — we open the DB once and reuse the connection
let _db: IDBDatabase | null = null

async function getDB(): Promise<IDBDatabase> {
  if (_db) return _db

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        // Index lets us query and sort by recency efficiently
        store.createIndex('by-timestamp', 'timestamp', { unique: false })
        store.createIndex('by-mood', 'mood', { unique: false })
      }
    }

    req.onsuccess = () => {
      _db = req.result
      resolve(_db)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function saveSession(
  session: Omit<AtmosphericSession, 'id'>,
): Promise<void> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).add(session)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getRecentSessions(limit = 8): Promise<AtmosphericSession[]> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('by-timestamp')
    const req = index.openCursor(null, 'prev') // descending = most recent first
    const sessions: AtmosphericSession[] = []

    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor && sessions.length < limit) {
        sessions.push(cursor.value)
        cursor.continue()
      } else {
        resolve(sessions)
      }
    }
    req.onerror = () => reject(req.error)
  })
}

export async function clearSessions(): Promise<void> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
