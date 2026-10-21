import { useSyncExternalStore } from 'react';

// Tracks whether the first-load preloader has finished so page intros can wait for it.
let done = false;
const listeners = new Set();

export const loader = {
  finish() {
    if (done) return;
    done = true;
    listeners.forEach((fn) => fn());
  },
  isDone: () => done,
};

export function useLoaderDone() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => done
  );
}
