// src/logger/app.logger.ts
import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { LogSeverity } from 'prisma/generated/prisma/enums';

type LogOptions = {
  userId?: string;
  severity?: LogSeverity;
};

@Injectable()
export class AppLogger extends Logger implements LoggerService {
  constructor() {
    super();
  }

  log(message: string, context?: string, options?: LogOptions): void {
    super.log(message, context);
    void this.logToDb(message, options);
  }

  warn(message: string, context?: string, options?: LogOptions): void {
    super.warn(message, context);
    void this.logToDb(message, options);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    options?: LogOptions,
  ): void {
    super.error(message, trace, context);
    void this.logToDb(`${message} ${trace || ''}`, {
      ...options,
      severity: options?.severity || 'high',
    });
  }

  private logToDb(message: string, options?: LogOptions) {
    if (!options || !options.userId) {
      return;
    }
    // TODO: re-enable queue-based logging when QueueModule is brought back
    // void this.queueProducer.addLoggerJob({
    //   user_id: options.userId,
    //   activity_log: message,
    //   severity: options.severity,
    // });
    console.log(
      `[LoggerQueue] ${message} (userId: ${options.userId}, severity: ${options.severity || 'low'})`,
    );
  }
}
