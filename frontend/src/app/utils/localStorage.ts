


// This is to get a certain item from localStorage
// We will pass in a key of the item we want to get


// For profile, the two types will be TrussProfile and TrussRole

export function getLS<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;


    //we will get an item using the key we passed in
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }
  
  export function setLS<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  export function removeLS(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
  