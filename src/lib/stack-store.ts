import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Metal = "gold" | "silver";
export type Base = "hoop" | "bangle";

export type SavedStack = {
  id: string;
  name: string;
  base: Base;
  metal: Metal;
  charmIds: string[];
  createdAt: number;
};

type State = {
  base: Base;
  metal: Metal;
  charmIds: string[];
  saved: SavedStack[];
  setBase: (base: Base) => void;
  setMetal: (metal: Metal) => void;
  toggleCharm: (id: string) => void;
  clearCharms: () => void;
  moveCharm: (id: string, direction: -1 | 1) => void;
  saveStack: (name: string) => void;
  loadStack: (id: string) => void;
  removeStack: (id: string) => void;
};

const MAX = 8;

export const useStackStore = create<State>()(
  persist(
    (set, get) => ({
      base: "hoop",
      metal: "gold",
      charmIds: [],
      saved: [],
      setBase: (base) => set({ base }),
      setMetal: (metal) => set({ metal }),
      toggleCharm: (id) => {
        const current = get().charmIds;
        if (current.includes(id)) {
          set({ charmIds: current.filter((c) => c !== id) });
          return;
        }
        if (current.length >= MAX) return;
        set({ charmIds: [...current, id] });
      },
      moveCharm: (id, direction) => {
        const ids = [...get().charmIds];
        const index = ids.indexOf(id),
          target = index + direction;
        if (index < 0 || target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        set({ charmIds: ids });
      },
      clearCharms: () => set({ charmIds: [] }),
      saveStack: (name) => {
        const { base, metal, charmIds, saved } = get();
        if (charmIds.length === 0) return;
        const next: SavedStack = {
          id: crypto.randomUUID(),
          name: name.trim() || "Untitled stack",
          base,
          metal,
          charmIds: [...charmIds],
          createdAt: Date.now(),
        };
        set({ saved: [next, ...saved].slice(0, 12) });
      },
      loadStack: (id) => {
        const found = get().saved.find((s) => s.id === id);
        if (!found) return;
        set({
          base: found.base,
          metal: found.metal,
          charmIds: found.charmIds,
        });
      },
      removeStack: (id) => set({ saved: get().saved.filter((s) => s.id !== id) }),
    }),
    { name: "ora-charm-stack", skipHydration: true },
  ),
);
