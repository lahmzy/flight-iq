import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { WEBHOOK_QUEUE } from 'src/infastructure/queues/queue.constants';
import { JobLabel } from 'src/infastructure/config/constants/static.constants';

@Processor(WEBHOOK_QUEUE)
export class WebHookConsumer extends WorkerHost {
  private readonly logger = new Logger(WebHookConsumer.name);

  constructor() {
    super();
  }
  //eslint-disable-next-line @typescript-eslint/require-await
  async process<T>(job: Job<T>) {
    switch (job.name) {
      case JobLabel.whatsapp:
        this.logger.log('Event Received for whatsapp', WebHookConsumer.name);
        break;
      default:
        this.logger.warn(`⚠️ Unknown job name: ${job.name}`);
    }
  }
}
