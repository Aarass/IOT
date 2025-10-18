export function dbg(value: unknown) {
  const stack = new Error().stack?.split("\n")[2];
  console.log(`[DBG] ${stack?.trim()}:`, value);
}
