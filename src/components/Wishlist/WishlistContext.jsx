"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "hero-kids-wishlist";

const getId = (product) => String(product._index ?? product.id ?? product.title);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, ready]);

  const addItem = useCallback((product) => {
    const id = getId(product);
    setItems((prev) => {
      if (prev.some((item) => item.id === id)) return prev;
      return [
        ...prev,
        {
          id,
          title: product.title,
          bangla: product.bangla,
          image: product.image,
          price: product.price,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleItem = useCallback(
    (product) => {
      const id = getId(product);
      setItems((prev) =>
        prev.some((item) => item.id === id)
          ? prev.filter((item) => item.id !== id)
          : [
              ...prev,
              {
                id,
                title: product.title,
                bangla: product.bangla,
                image: product.image,
                price: product.price,
              },
            ],
      );
    },
    [],
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const ids = items.map((item) => item.id);
    return {
      items,
      count: items.length,
      ready,
      ids,
      hasItem: (product) => ids.includes(getId(product)),
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
    };
  }, [items, ready, addItem, removeItem, toggleItem, clearWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
};

export { getId };
