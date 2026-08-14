export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return 'Unknown';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  const decimals = unitIndex === 0 ? 0 : size < 10 ? 1 : 0;
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function isRecentlyUpdated(date: string | Date, days = 30): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return false;
  const diff = Date.now() - d.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export function androidVersionName(version: string): string {
  const map: Record<string, string> = {
    '5.0': 'Lollipop',
    '5.1': 'Lollipop',
    '6.0': 'Marshmallow',
    '7.0': 'Nougat',
    '7.1': 'Nougat',
    '8.0': 'Oreo',
    '8.1': 'Oreo',
    '9.0': 'Pie',
    '10.0': 'Android 10',
    '11.0': 'Android 11',
    '12.0': 'Android 12',
    '13.0': 'Android 13',
    '14.0': 'Android 14',
    '15.0': 'Android 15',
  };
  return map[version] ?? `Android ${version}`;
}

