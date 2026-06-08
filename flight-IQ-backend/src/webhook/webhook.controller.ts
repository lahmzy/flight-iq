import { Body, Controller, Post } from '@nestjs/common';

import { JobLabel } from 'src/infastructure/config/constants/static.constants';
import { QueueProducerService } from 'src/infastructure/queues/producers/queue.producer';
import { WebhookType } from 'src/infastructure/queues/queue.type';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly queueProducer: QueueProducerService) {}

  @Post('whastapp')
  handleWhatsAppWebhook(@Body() body: WebhookType<any>) {
    void this.queueProducer.addWebhookJob({
      name: JobLabel.whatsapp,
      data: body,
    });
    return {
      message: 'Webhook received',
    };
  }
}
