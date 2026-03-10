let count = 0;

export function increment(): number {
  count += 1;
  return count;
}

export function getCount(): number {
  return count;
}
