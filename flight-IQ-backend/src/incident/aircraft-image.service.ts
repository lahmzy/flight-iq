import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { Aircraft } from 'prisma/generated/prisma/client';

@Injectable()
export class AircraftImageService {
  private readonly logger = new Logger(AircraftImageService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isBadImageUrl(url: string | null): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.pdf') || lower.includes('.svg');
  }

  async ensureAircraftImage(aircraft: Aircraft): Promise<Aircraft> {
    if (aircraft.imageUrl && !this.isBadImageUrl(aircraft.imageUrl)) {
      return aircraft;
    }

    try {
      const imageUrl = await this.fetchImageFromWikimedia(aircraft);

      if (imageUrl) {
        try {
          await this.prisma.aircraft.update({
            where: { id: aircraft.id },
            data: { imageUrl },
          });
        } catch (dbError) {
          this.logger.warn(`Could not save image URL to DB for aircraft ${aircraft.id} (likely rate limits), but will return it to client.`);
        }

        return { ...aircraft, imageUrl };
      }

      return aircraft;
    } catch (err) {
      this.logger.error(`Error fetching image for aircraft ${aircraft.id}:`, err);
      return aircraft;
    }
  }

  private async fetchImageFromWikimedia(aircraft: Aircraft): Promise<string | null> {
    // 1. Try registration number first (most specific)
    if (aircraft.registrationNo && aircraft.registrationNo.trim().length > 2) {
      const url = await this.queryWikimedia(`${aircraft.registrationNo} aircraft`);
      if (url) return url;
      const url2 = await this.queryWikimedia(aircraft.registrationNo);
      if (url2) return url2;
    }

    // 2. Fallback to make and model (e.g. "Boeing 737")
    if (aircraft.make && aircraft.model) {
      const query = `${aircraft.make} ${aircraft.model}`.trim();
      const url = await this.queryWikimedia(`${query} aircraft`);
      if (url) return url;
      const url2 = await this.queryWikimedia(query);
      if (url2) return url2;
    }

    // 3. Fallback to make only (e.g. "Piper", "Boeing")
    if (aircraft.make) {
      const url = await this.queryWikimedia(`${aircraft.make} aircraft`);
      if (url) return url;
    }

    return null;
  }

  private isImageUrl(url: string): boolean {
    const ext = url.split('.').pop()?.toLowerCase().split(/[?#]/)[0] || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }

  private async queryWikimedia(query: string): Promise<string | null> {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrwhat=text&prop=imageinfo&iiprop=url|mime&format=json`;
    
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
        const imagePage = pages.find((p: any) =>
          p.imageinfo?.some((info: any) =>
            info.mime?.startsWith('image/') && this.isImageUrl(info.url)
          )
        );
        if (imagePage) {
          return imagePage.imageinfo[0].url;
        }
      }
    } catch (error) {
      this.logger.error(`Wikimedia fetch failed for query '${query}'`, error);
    }
    
    return null;
  }
}
