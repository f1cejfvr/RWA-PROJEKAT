import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';
import { Team } from './team.entity';
import { User } from '../users/user.entity';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('city') city?: string) {
    return this.teamsService.findAll({ category, city });
  }

  @Get(':id/join-requests')
  @UseGuards(AuthGuard('jwt'))
  getJoinRequests(@Param('id') id: string) {
    return this.teamsService.getJoinRequests(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<Team>, @Request() req: { user: { userId: number; email: string } }) {
    const captain = { id: req.user.userId, email: req.user.email } as User;
    return this.teamsService.create(data, captain);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Team>) {
    return this.teamsService.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join-request')
  requestToJoin(@Param('id') id: string, @Request() req: { user: { userId: number; email: string } }) {
    const applicant = { id: req.user.userId, email: req.user.email } as User;
    return this.teamsService.requestToJoin(+id, applicant);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('join-requests/:requestId')
  respondToJoinRequest(@Param('requestId') requestId: string, @Body('status') status: string) {
    return this.teamsService.respondToJoinRequest(+requestId, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(+id, +userId);
  }
}
