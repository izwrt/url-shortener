const BASE62 =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function toBase62(num: number): string {
  if (num === 0) return "0";
  if (num < 0) throw new Error("Counter value must be non-negative");

  let result = "";
  let n = num;

  while (n > 0) {
    result = BASE62[n % 62] + result;
    n = Math.floor(n / 62);
  }

  return result;
}