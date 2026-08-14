import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { CommentController } from './comment.controller';
import { IncidentService } from './incident.service';
import { CommentService } from './comment.service';
import { AircraftImageService } from './aircraft-image.service';

@Module({
  controllers: [IncidentController, CommentController],
  providers: [IncidentService, CommentService, AircraftImageService],
})
export class IncidentModule {}
