import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: string, incidentId: string, dto: CreateCommentDto) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
    });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return this.prisma.comment.create({
      data: {
        incidentId,
        authorId: userId,
        text: dto.text,
      },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  async getCommentsByIncidentId(incidentId: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
    });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return this.prisma.comment.findMany({
      where: { incidentId },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
