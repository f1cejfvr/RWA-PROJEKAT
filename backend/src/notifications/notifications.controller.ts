import { Controller, Get, Put, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getMyNotifications(@Request() req: { user: { userId: number } }) {
    return this.notificationsService.getMyNotifications(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('read-all')
  markAllAsRead(@Request() req: { user: { userId: number } }) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
