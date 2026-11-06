import { useCallback, useEffect, useState } from "react";
import { GOLD_24K } from "@/utils/format";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | SHRIING`;
  }, [title]);
}

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export function useMockCollection<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useLocalState<T[]>(`shriing-mock-${key}`, seed);
  const add = useCallback((item: T) => setItems((s) => [item, ...s]), [setItems]);
  const update = useCallback((id: string, patch: Partial<T>) => setItems((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))), [setItems]);
  const remove = useCallback((id: string) => setItems((s) => s.filter((x) => x.id !== id)), [setItems]);
  return { items, add, update, remove, setItems };
}

export function useGoldRate() {
  const [rate, setRate] = useState(GOLD_24K);
  const [delta, setDelta] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setRate((r) => {
        const next = Math.round(r + (Math.random() - 0.48) * 22);
        setDelta(next - GOLD_24K);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);
  return { rate, delta };
}

export function useObjectUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const set = (file: File | null) => {
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return file ? URL.createObjectURL(file) : null;
    });
  };
  return [url, set] as const;
}
