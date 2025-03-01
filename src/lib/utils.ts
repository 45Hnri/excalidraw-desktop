import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResolvablePromise } from "@excalidraw/excalidraw/types/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const resolvablePromise = () => {
  let resolve!: any;
  let reject!: any;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  (promise as any).resolve = resolve;
  (promise as any).reject = reject;
  return promise as ResolvablePromise<any>;
};
