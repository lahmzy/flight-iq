/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-return */
/* eslint-disable  @typescript-eslint/no-unsafe-argument */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma } from 'prisma/generated/prisma/browser';
import { PrismaClient } from 'prisma/generated/prisma/client';
import { AppConfig } from 'src/infastructure/config/env/env';

type PrismaModel = keyof typeof Prisma.ModelName;

const SOFT_DELETE_MODELS: PrismaModel[] = [];

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService<AppConfig>) {
    // super({ log: ['query', 'info', 'warn', 'error'] });
    const connectionString = configService.get('database_url');

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });

    // Build an extended PrismaClient
    const extended = this.$extends(this.softDeleteExtension())
      .$extends(this.findUniqueOrThrowExtension())
      .$extends(this.stripDeletedAtExtension());

    // Merge all extended methods/behaviors into *this*
    Object.assign(this, extended);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // --- Extensions ---
  private findUniqueOrThrowExtension() {
    return {
      model: {
        $allModels: {
          async findUniqueOrThrow<T, A>(
            this: T,
            args: Prisma.Args<T, 'findUnique'>,
            errorMessage?: string,
          ): Promise<Prisma.Result<T, A, 'findUnique'>> {
            const result = await (this as any).findUnique(args);
            if (!result) {
              throw new NotFoundException(errorMessage || 'Record not found.');
            }
            return result;
          },
        },
      },
    };
  }

  private softDeleteExtension() {
    return {
      query: {
        $allModels: {
          $allOperations({ model, operation, args, query }) {
            if (!SOFT_DELETE_MODELS.includes(model as PrismaModel)) {
              return query(args);
            }

            const readOps = [
              'findUnique',
              'findUniqueOrThrow',
              'findFirst',
              'findFirstOrThrow',
              'findMany',
              'count',
              'aggregate',
              'groupBy',
            ];

            const writeOpsWithWhere = [
              'update',
              'updateMany',
              'delete',
              'deleteMany',
            ];
            if (readOps.includes(operation)) {
              if (args.where) {
                if (
                  operation === 'findUnique' ||
                  operation === 'findUniqueOrThrow'
                ) {
                  // Merge directly (cannot use AND here)
                  args.where = { ...args.where, deleted_at: null };
                } else {
                  args.where = {
                    AND: [args.where, { deleted_at: null }],
                  };
                }
              } else {
                args.where = { deleted_at: null };
              }
            } else if (writeOpsWithWhere.includes(operation)) {
              if (operation === 'update' || operation === 'delete') {
                // For single record operations, add deleted_at check to where clause
                if (args.where) {
                  args.where.deleted_at = null;
                }
              } else if (
                operation === 'updateMany' ||
                operation === 'deleteMany'
              ) {
                // For many operations, we can use AND clause
                if (args.where) {
                  args.where = {
                    AND: [args.where, { deleted_at: null }],
                  };
                } else {
                  args.where = { deleted_at: null };
                }
              }
            }

            return query(args);
          },
        },
      },
    };
  }

  private stripDeletedAtExtension() {
    return {
      query: {
        $allModels: {
          async $allOperations({ model, args, query }) {
            const result = await query(args);

            // Only strip deleted_at from soft delete models
            if (!SOFT_DELETE_MODELS.includes(model as PrismaModel)) {
              return result;
            }

            // Strip deleted_at from results
            if (result) {
              if (Array.isArray(result)) {
                return result.map((item: any) => {
                  if (
                    item &&
                    typeof item === 'object' &&
                    'deleted_at' in item
                  ) {
                    const { deleted_at, ...rest } = item;
                    void deleted_at;
                    return rest;
                  }
                  return item;
                });
              } else if (typeof result === 'object' && 'deleted_at' in result) {
                const { deleted_at, ...rest } = result;
                void deleted_at;
                return rest;
              }
            }

            return result;
          },
        },
      },
    };
  }

  withSoftDeleted() {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            // This extension does no filtering, returns all records
            return query(args);
          },
        },
      },
    });
  }

  // return await this.prisma.withSoftDeleted().userPaymentAccount.findMany({
  //   where: {
  //     user_id: currentUser.user_id
  //   }
  // })
}
