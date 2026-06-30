import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { Aircraft } from 'prisma/generated/prisma/client';

@Injectable()
export class AircraftImageService {
  private readonly logger = new Logger(AircraftImageService.name);
  
  // Generic fallback if we can't find anything
  private readonly GENERIC_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Boeing_737-400_Centralwings_2.JPG';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks if the aircraft lacks an image, fetches one from Wikimedia Commons if so,
   * gracefully attempts to save it, and returns the updated aircraft.
   */
  async ensureAircraftImage(aircraft: Aircraft): Promise<Aircraft> {
    if (aircraft.imageUrl) {
      return aircraft;
    }

    try {
      const imageUrl = await this.fetchImageFromWikimedia(aircraft);
      
      const resultImageUrl = imageUrl || this.GENERIC_FALLBACK;
      
      // Attempt to save to database, but gracefully handle quota/connection errors
      try {
        await this.prisma.aircraft.update({
          where: { id: aircraft.id },
          data: { imageUrl: resultImageUrl },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (dbError) {
        this.logger.warn(`Could not save image URL to DB for aircraft ${aircraft.id} (likely rate limits), but will return it to client.`);
      }

      return {
        ...aircraft,
        imageUrl: resultImageUrl,
      };
    } catch (err) {
      this.logger.error(`Error fetching image for aircraft ${aircraft.id}:`, err);
      return {
        ...aircraft,
        imageUrl: this.GENERIC_FALLBACK,
      };
    }
  }

  private async fetchImageFromWikimedia(aircraft: Aircraft): Promise<string | null> {
    // 1. Try registration number first (most specific)
    if (aircraft.registrationNo && aircraft.registrationNo.trim().length > 2) {
      const url = await this.queryWikimedia(aircraft.registrationNo);
      if (url) return url;
    }

    // 2. Fallback to make and model (e.g. "Boeing 737")
    if (aircraft.make && aircraft.model) {
      const query = `${aircraft.make} ${aircraft.model}`.trim();
      const url = await this.queryWikimedia(query);
      if (url) return url;
    }

    return null;
  }

  private async queryWikimedia(query: string): Promise<string | null> {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;
    
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'FlightIQ-Backend-Service/1.0',
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data?.query?.pages) {
        const pages = Object.values(data.query.pages) as any[];
        if (pages.length > 0 && pages[0].imageinfo?.length > 0) {
          return pages[0].imageinfo[0].url;
        }
      }
    } catch (error) {
      this.logger.error(`Wikimedia fetch failed for query '${query}'`, error);
    }
    
    return null;
  }
}
