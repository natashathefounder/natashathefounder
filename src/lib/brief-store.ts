import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Brief = {
  who: string;
  vision: string;
  budget: string;
  stones: string;
  when: string;
};

const empty: Brief = { who: "", vision: "", budget: "", stones: "", when: "" };

type State = Brief & {
  setField: (key: keyof Brief, value: string) => void;
  reset: () => void;
};

export const useBriefStore = create<State>()(
  persist(
    (set) => ({
      ...empty,
      setField: (key, value) => set({ [key]: value }),
      reset: () => set(empty),
    }),
    { name: "ora-custom-brief", skipHydration: true },
  ),
);

export function briefMailto(brief: Brief) {
  const body = [
    `Who it's for: ${brief.who}`,
    `Vision: ${brief.vision}`,
    `Budget: ${brief.budget}`,
    `Stones: ${brief.stones}`,
    `When: ${brief.when}`,
  ].join("\n\n");
  return `mailto:hello@orajewellery.com?subject=${encodeURIComponent("Custom jewellery brief")}&body=${encodeURIComponent(body)}`;
}
