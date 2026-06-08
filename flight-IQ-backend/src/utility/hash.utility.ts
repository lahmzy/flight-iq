import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as crypto from 'crypto';
import DeviceDetector from 'node-device-detector';

import { capitalizeLetter } from 'src/utility/text.utility';

export async function bcryptHash({ content }: { content: string }) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(content, salt);
  return hashed;
}

export async function bcryptCompare({
  content,
  hashedContent,
}: {
  content: string;
  hashedContent?: string;
}) {
  const isValid = await bcrypt.compare(content, hashedContent || '');
  return isValid;
}

export function extractDeviceData(req: Request) {
  const userAgent = req.header('user-agent') || req.headers['user-agent'] || '';

  if (!userAgent) {
    throw new BadRequestException('User-Agent header is required.');
  }

  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: false,
    maxUserAgentSize: 500,
  });

  const result = detector.detect(userAgent);

  const osName = result.os?.name || '';
  const osVersion = result.os?.version || '';
  const clientName = result.client?.name || '';
  const clientVersion = result.client?.version || '';
  const deviceBrand = result.device?.brand || '';
  const deviceType = result.device?.type || '';

  let devicePart = deviceBrand || 'Unknown';
  if (deviceType) {
    devicePart += ` ${capitalizeLetter(deviceType)}`;
  }

  let osPart = '';

  if (osName) {
    osPart = osVersion ? `${osName} ${osVersion}` : osName;
  }

  let clientPart = '';
  if (clientName) {
    clientPart = clientVersion ? `${clientName} ${clientVersion}` : clientName;
  }

  let name = devicePart;

  if (osPart) {
    name += ` (${osPart})`;
  }

  if (clientPart) {
    name += ` - ${clientPart}`;
  }

  const deviceString = JSON.stringify(result);

  const fingerprint = crypto
    .createHash('sha256')
    .update(deviceString)
    .digest('hex');

  return {
    fingerPrint: fingerprint,
    name: name || 'Unknown Device',
    type: deviceType,
    brand: capitalizeLetter(deviceBrand),
  };
}
