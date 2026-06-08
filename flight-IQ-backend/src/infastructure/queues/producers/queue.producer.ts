import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import {
  CRON_QUEUE,
  EMAIL_QUEUE,
  LOGGER_QUEUE,
  WEBHOOK_QUEUE,
} from 'src/infastructure/queues/queue.constants';
import {
  EmailTransactionQueueType,
  LoggerType,
  WebhookType,
} from 'src/infastructure/queues/queue.type';

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);
  constructor(
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(LOGGER_QUEUE) private readonly loggerQue: Queue,
    @InjectQueue(CRON_QUEUE) private readonly cronQueue: Queue,
    @InjectQueue(WEBHOOK_QUEUE) private readonly webHookQueue: Queue,
  ) {}

  async addEmailJob(data: EmailTransactionQueueType): Promise<void> {
    await this.emailQueue.add('sendTransactionEmail', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
    this.logger.log(`Added email job for ${data.to} to the queue.`);
  }

  async addLoggerJob(data: LoggerType) {
    await this.loggerQue.add('userActivityLog', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addCleanUpJob() {
    await this.cronQueue.add('cleanUp', null, {
      attempts: 1,
      delay: 1000,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addWebhookJob<T>(data: WebhookType<T>) {
    await this.webHookQueue.add(data.name, data.data, {
      attempts: 1,
      delay: 1000,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
    this.logger.log(`Added wehook job for ${data.name} to the queue.`);
  }
}
