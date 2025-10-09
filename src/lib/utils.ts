export type ClassValue = string | number | null | false | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const flatten = (arr: ClassValue[], acc: string[] = []): string[] => {
    for (const item of arr) {
      if (!item && item !== 0) continue;
      if (Array.isArray(item)) {
        flatten(item, acc);
      } else {
        acc.push(String(item));
      }
    }
    return acc;
  };
  return flatten(inputs).join(" ").trim().replace(/\s+/g, " ");
}


