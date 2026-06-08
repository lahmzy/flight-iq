import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { EMAIL_QUEUE } from 'src/infastructure/queues/queue.constants';
import { EmailTransactionQueueType } from 'src/infastructure/queues/queue.type';
import { MailerService } from 'src/infastructure/services/mailer/mailer.service';

@Processor(EMAIL_QUEUE)
export class EmailQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(EmailQueueConsumer.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<EmailTransactionQueueType>) {
    this.logger.log(`Received job: ${job.name} for ${job.data.to}`);

    switch (job.name) {
      case 'sendTransactionEmail':
        await this.handleTransactionEmail(job);
        break;

      case 'sendWelcomeEmail':
        await this.handleWelcomeEmail(job);
        break;

      default:
        this.logger.warn(`⚠️ Unknown job name: ${job.name}`);
    }
  }

  private async handleTransactionEmail(job: Job<EmailTransactionQueueType>) {
    this.logger.log(`📧 Sending transaction email to ${job.data.to}`);

    await this.mailerService.sendMail({
      to: job.data.to,
      subject: job.data.subject,
      replacements: job.data.replacements,
      fileName: job.data.fileName,
      from: job.data.from,
    });
    this.logger.log('Transaction Email Completed');
  }

  private async handleWelcomeEmail(job: Job<EmailTransactionQueueType>) {
    this.logger.log(`📧 Sending welcome email to ${job.data.to}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log(`✅ Welcome email sent to ${job.data.to}`);
  }
}
