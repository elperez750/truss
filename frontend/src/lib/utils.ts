import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



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
