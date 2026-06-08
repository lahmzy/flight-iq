import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { CRON_QUEUE } from 'src/infastructure/queues/queue.constants';
import { AppLogger } from 'src/infastructure/logger/app.logger';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';

@Processor(CRON_QUEUE)
export class CronConsumer extends WorkerHost {
  constructor(
    private readonly logger: AppLogger,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'cleanUp':
        await this.cleanUp(job);
        break;
    }
  }

  private async cleanUp(job: Job) {
    this.logger.log(
      `Running scheduled cleanup service at ${new Date().toISOString()} for ${job.name}`,
      'Cron Consumner',
    );

    const now = new Date();

    const { deletedSessionCount, deletedOtpCount } =
      await this.prisma.$transaction(async (tx) => {
        const { count: deletedSessionCount } = await tx.session.deleteMany({
          where: {
            expires_at: {
              lte: now,
            },
          },
        });

        const { count: deletedOtpCount } = await this.prisma.otp.deleteMany({
          where: {
            expired_at: {
              lte: now,
            },
          },
        });

        return {
          deletedSessionCount,
          deletedOtpCount,
        };
      });

    this.logger.log(
      `Clean up overview -> (Deleted Sessions:${deletedSessionCount}),(Deleted OTP's:${deletedOtpCount})`,
      CronConsumer.name,
    );
  }
}
