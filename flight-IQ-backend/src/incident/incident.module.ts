import { Module } from '@nestjs/common';

import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { AircraftImageService } from './aircraft-image.service';

@Module({
  controllers: [IncidentController],
  providers: [IncidentService, AircraftImageService],
})
export class IncidentModule {}
