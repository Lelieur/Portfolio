import type { Thought } from "./types";

export type ThoughtActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof Thought, string>>;
  activeId: string;
};

export function emptyThoughtActionState(activeId: string): ThoughtActionState {
  return {
    status: "idle",
    message: null,
    fieldErrors: {},
    activeId,
  };
}
