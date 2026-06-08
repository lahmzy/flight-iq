import { LogSeverity } from 'prisma/generated/prisma/enums';

export type EmailTransactionQueueType = {
  to: string;
  replacements: Record<string, string>;
  fileName: string;
  subject: string;
  from?: string;
};

export type LoggerType = {
  user_id: string;
  severity?: LogSeverity;
  activity_log: string;
};

export type WebhookType<T> = {
  name: string;
  data: T;
};
