export type ClassValue = string | number | boolean | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed) classes.push(trimmed);
    } else if (typeof input === "number") {
      classes.push(String(input));
    }
  }
  return classes.join(" ");
}
