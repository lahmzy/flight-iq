import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';
import { CurrentUser, IsPublic } from 'src/auth/auth.decorator';
import { UserMetaData } from 'src/auth/auth.types';

@Controller('incidents/:incidentId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Param('incidentId') incidentId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() currentUser: UserMetaData,
  ) {
    return this.commentService.createComment(currentUser.user_id, incidentId, dto);
  }

  @Get()
  @IsPublic()
  async findAll(@Param('incidentId') incidentId: string) {
    return this.commentService.getCommentsByIncidentId(incidentId);
  }
}
