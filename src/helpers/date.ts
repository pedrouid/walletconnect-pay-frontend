import * as DateFNS from "date-fns";

export function formatDate(timestamp: number, format: string): string {
  const date = new Date(timestamp);
  const result = DateFNS.format(date, format);
  return result;
}
