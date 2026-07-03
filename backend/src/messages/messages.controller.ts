import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('team/:teamId')
  getTeamMessages(@Param('teamId') teamId: string) {
    return this.messagesService.getTeamMessages(+teamId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('team/:teamId')
  sendMessage(
    @Param('teamId') teamId: string,
    @Body('content') content: string,
    @Request() req: { user: { userId: number; email: string } },
  ) {
    const sender = { id: req.user.userId, email: req.user.email } as User;
    const team = { id: +teamId } as Team;
    return this.messagesService.sendMessage(content, sender, team);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
