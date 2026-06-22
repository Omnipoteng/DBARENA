const USER_KEY_STORAGE = "dba-user-key"; 

export function getDbaUserKey() { 
  if (typeof window === "undefined") { 
    return "dba-server"; 
  }

  const stored = window.localStorage.getItem(USER_KEY_STORAGE);
  if (stored) return stored;

  const next = `dba-${crypto.randomUUID()}`;
  window.localStorage.setItem(USER_KEY_STORAGE, next); 
  return next; 
} 

export function setDbaUserKey(next: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(USER_KEY_STORAGE, next);
}

export function clearDbaUserKey() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(USER_KEY_STORAGE);
}

export function readDbaUserKey() { 
  if (typeof window === "undefined") { 
    return null; 
  } 

  return window.localStorage.getItem(USER_KEY_STORAGE);
}
