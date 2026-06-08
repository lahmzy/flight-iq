/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-unsafe-argument */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractDeviceData } from 'src/utility/hash.utility';

export const Device = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return extractDeviceData(request);
  },
);

export type DeviceData = ReturnType<typeof extractDeviceData>;
