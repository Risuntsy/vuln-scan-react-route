
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function randomInt(start: number, end?: number) {
  if (end === undefined) {
    [start, end] = [0, start];
  }
  return Math.floor(Math.random() * (end - start + 1)) + start;
}


export function parseNumberParam(value?: string | number, defaultValue?: number) {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === "string") {
    return parseInt(value) || defaultValue;
  }
  return value || defaultValue;
}

export function parseStringParam(value?: string, defaultValue?: string) {
  return typeof value === "string" ? value : defaultValue;
}
