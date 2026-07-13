import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { User } from '../users/user.entity';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('city') city?: string, @Query('type') type?: string) {
    return this.eventsService.findAll({ category, city, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<Event>, @Request() req: { user: { userId: number; email: string } }) {
    const organizer = { id: req.user.userId, email: req.user.email } as Event['organizer'];
    return this.eventsService.create(data, organizer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Event>) {
    return this.eventsService.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/apply')
  apply(
    @Param('id') id: string,
    @Body('message') message: string,
    @Body('teamId') teamId: number,
    @Request() req: { user: { userId: number; email: string } },
  ) {
    const applicant = { id: req.user.userId, email: req.user.email } as User;
    return this.eventsService.apply(+id, applicant, message, teamId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/applications')
  getApplications(@Param('id') id: string) {
    return this.eventsService.getApplications(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('applications/:applicationId/status')
  updateStatus(@Param('applicationId') applicationId: string, @Body('status') status: string) {
    return this.eventsService.updateApplicationStatus(+applicationId, status);
  }
}
