import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';

import { AppEnvironmentService } from 'src/infastructure/config/common/app.environment.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly appEnvService: AppEnvironmentService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: Number(this.configService.get('email.port')),
      auth: {
        user: this.configService.get('email.username'),
        pass: this.configService.get('email.password'),
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    fileName: string;
    replacements: Record<string, string>;
    from?: string;
  }): Promise<void> {
    if (this.appEnvService.isDeployed()) {
      try {
        const { to, subject, fileName: templateName, replacements } = options;

        const templatePath = path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'templates',
          templateName,
        );

        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate(replacements);

        const mailOptions = {
          from: options.from || 'noreply@utilour.ng',
          to,
          subject,
          html,
        };

        await this.transporter.sendMail(mailOptions);

        this.logger.log(`Mail sent to ${to} with subject "${subject}"`);
      } catch (error) {
        this.logger.error('Error sending email:', error);
        throw new InternalServerErrorException('Failed to send email');
      }
    } else {
      this.logger.log('Skipped mail due to dev mode', options.replacements);
    }
  }
}
