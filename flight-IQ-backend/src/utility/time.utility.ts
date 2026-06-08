export function ConvertMinutesToMilliseconds(minutes: number): number {
  return minutes * 60 * 1000;
}

export function convertSecondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}

type RangeType = 'min' | 'hour' | 'day' | 'month';

type TimeOptions = {
  time: number;
  type: 'add' | 'subtract';
  rangeType: RangeType;
};

export function calculateDate(opts: TimeOptions): Date {
  const { time, type, rangeType } = opts;

  const resultDate = new Date();

  const offset = type === 'subtract' ? -time : time;

  switch (rangeType) {
    case 'min':
      resultDate.setMinutes(resultDate.getMinutes() + offset);
      break;
    case 'hour':
      resultDate.setHours(resultDate.getHours() + offset);
      break;
    case 'day':
      resultDate.setDate(resultDate.getDate() + offset);
      break;
    case 'month':
      resultDate.setMonth(resultDate.getMonth() + offset);
      break;
    default:
      throw new Error(
        `Unsupported rangeType: ${rangeType as unknown as string}`,
      );
  }

  return resultDate;
}

export function parseExpirationToSeconds(input: string): number {
  const unit = input.slice(-1);
  const value = parseInt(input.slice(0, -1));

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}

export function formatDateToReadableString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}

export function getExpiryDateString({
  expMonth,
  expYear,
}: {
  expMonth: string;
  expYear: string;
}): string {
  const month = String(expMonth).padStart(2, '0');
  const year = String(expYear);

  const date = new Date(parseInt(year), parseInt(month) - 1, 1);

  return date.toISOString();
}
export function captureFirstDigit(input: string): number {
  const match = input.match(/^(\d+)/);
  if (!match) {
    throw new Error(`No number found in time string: ${input}`);
  }
  return parseInt(match[1], 10);
}
