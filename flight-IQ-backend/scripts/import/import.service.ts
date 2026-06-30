import * as fs from 'fs';
import { parse, ParserOptionsArgs } from '@fast-csv/parse';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

/**
 * Helper type describing the result of processing a CSV row.
 */
interface RowResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic import service that can be extended for different CSV imports.
 *
 * Usage pattern (example for Aircraft import):
 * ```ts
 * const service = new ImportService<AircraftRow>(
 *   'c:/path/to/aircraft.csv',
 *   parseAircraftRow,
 *   async (prisma, rows) => {
 *     await prisma.$transaction(
 *       rows.map(r =>
 *         prisma.aircraft.upsert({
 *           where: { ntsbEventId_ntsbAircraftKey: { ntsbEventId: r.ntsbEventId, ntsbAircraftKey: r.ntsbAircraftKey } },
 *           update: { ...r },
 *           create: { ...r },
 *         })
 *       )
 *     );
 *   },
 *   { chunkSize: 500 }
 * );
 * await service.run();
 * ```
 */
export class ImportService<T> {
  private readonly prisma: PrismaClient;
  private totalRows: number = 0;
  private processedRows: number = 0;
  private invalidRows: number = 0;

  /**
   * @param filePath Absolute path to the CSV file.
   * @param rowMapper Function that receives a raw CSV record and returns a RowResult<T>.
   * @param batchHandler Async function that receives the Prisma client and an array of valid rows to persist.
   * @param options Optional configuration (chunk size, CSV parse options, header row handling).
   */
  constructor(
    private readonly filePath: string,
    private readonly rowMapper: (
      record: Record<string, string>,
    ) => RowResult<T>,
    private readonly batchHandler: (
      prisma: PrismaClient,
      rows: T[],
    ) => Promise<void>,
    private readonly options?: {
      chunkSize?: number;
      parseOptions?: ParserOptionsArgs;
      hasHeader?: boolean;
    },
  ) {
    const connectionString = process.env['DATABASE_URL'];
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    } as any);
  }

  /**
   * Main entry point – reads the CSV, validates rows, and persists them in chunks.
   */
  public async run(): Promise<void> {
    const chunkSize = this.options?.chunkSize ?? 500;
    const parseOpts: ParserOptionsArgs = {
      headers: this.options?.hasHeader ?? true,
      ignoreEmpty: true,
      ...this.options?.parseOptions,
    };

    const stream = fs.createReadStream(this.filePath);
    const parser = parse(parseOpts);
    const rowsBuffer: T[] = [];

    return new Promise<void>((resolve, reject) => {
      parser
        .on('error', (error) => reject(error))
        .on('data', async (data: Record<string, string>) => {
          this.totalRows++;
          const result = this.rowMapper(data);
          if (result.success && result.data) {
            rowsBuffer.push(result.data);
            if (rowsBuffer.length >= chunkSize) {
              parser.pause(); // back‑pressure
              try {
                await this.persistChunk(
                  rowsBuffer.splice(0, rowsBuffer.length),
                );
                this.logProgress();
              } catch (e) {
                reject(e);
                return;
              }
              parser.resume();
            }
          } else {
            this.invalidRows++;
            console.warn(`Invalid row #${this.totalRows}: ${result.error}`);
          }
        })
        .on('end', async () => {
          // Persist any remaining rows
          if (rowsBuffer.length > 0) {
            try {
              await this.persistChunk(rowsBuffer);
            } catch (e) {
              reject(e);
              return;
            }
          }
          this.logProgress(true);
          await this.prisma.$disconnect();
          resolve();
        });

      stream.pipe(parser);
    });
  }

  private async persistChunk(chunk: T[]): Promise<void> {
    await this.batchHandler(this.prisma, chunk);
    this.processedRows += chunk.length;
  }

  private logProgress(final: boolean = false): void {
    const message = final
      ? `Import complete – processed ${this.processedRows}/${this.totalRows} rows (invalid: ${this.invalidRows}).`
      : `Imported ${this.processedRows}/${this.totalRows} rows (invalid: ${this.invalidRows})...`;
    console.log(message);
  }
}
