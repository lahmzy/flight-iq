export function generateRef(prepend: string, length?: number): string {
  const idLength = length && length > 0 ? length : 12;

  let id = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  if (!prepend) {
    return id;
  }
  return `${prepend}_${id}`;
}

export function generateOTP(): string {
  const otpLength = 6;
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
