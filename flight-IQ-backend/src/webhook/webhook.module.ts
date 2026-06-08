import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [WebhookController],
  providers: [],
})
export class WebhookModule {}
