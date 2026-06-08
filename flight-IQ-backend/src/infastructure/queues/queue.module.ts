import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { QueueProducerService } from 'src/infastructure/queues/producers/queue.producer';
import { EmailQueueConsumer } from 'src/infastructure/queues/consumers/email.consumer';
import { QueueList } from 'src/infastructure/queues/queue.constants';
import { CronConsumer } from 'src/infastructure/queues/consumers/cron.consumer';
import { ConstantsModule } from 'src/infastructure/config/constants/constants.module';
import { LoggerQueueConsumer } from 'src/infastructure/queues/consumers/logger.consumer';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { WebHookConsumer } from 'src/infastructure/queues/consumers/webhook.consumer';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    ConstantsModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>(
          'redis.url',
          'redis://localhost:6379',
        );
        return {
          connection: {
            url: redisUrl,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(...QueueList),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      ...QueueList.map((queue) => ({
        name: queue.name,
        adapter: BullMQAdapter,
      })),
    ),
  ],
  providers: [
    QueueProducerService,
    PrismaService,
    EmailQueueConsumer,
    CronConsumer,
    LoggerQueueConsumer,
    WebHookConsumer,
  ],
  exports: [QueueProducerService],
})
export class QueueModule {}
