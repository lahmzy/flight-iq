import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { LOGGER_QUEUE } from 'src/infastructure/queues/queue.constants';
import { LoggerType } from 'src/infastructure/queues/queue.type';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';

@Processor(LOGGER_QUEUE)
export class LoggerQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(LoggerQueueConsumer.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async process(job: Job<LoggerType>) {
    switch (job.name) {
      case 'userActivityLog':
        await this.logUserActivity(job);
        break;

      default:
        this.logger.warn(`⚠️ Unknown job name: ${job.name}`);
    }
  }

  private async logUserActivity(job: Job<LoggerType>) {
    await this.prisma.userActivityLog.create({
      data: {
        user_id: job.data.user_id,
        activity_log: job.data.activity_log,
        severity: job.data.severity,
      },
    });
  }
}
