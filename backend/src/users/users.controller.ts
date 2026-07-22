import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: { user: { userId: number } }) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friend-requests')
  getFriendRequests(@Request() req: { user: { userId: number } }) {
    return this.usersService.getFriendRequests(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friend-requests/sent')
  getSentFriendRequests(@Request() req: { user: { userId: number } }) {
    return this.usersService.getSentFriendRequests(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('friend-requests/:requestId')
  respondToFriendRequest(@Param('requestId') requestId: string, @Body('status') status: string) {
    return this.usersService.respondToFriendRequest(+requestId, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.usersService.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/friends')
  getFriends(@Param('id') id: string) {
    return this.usersService.getFriends(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/friends/:friendId')
  addFriend(@Param('id') id: string, @Param('friendId') friendId: string) {
    return this.usersService.addFriend(+id, +friendId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/friend-request')
  sendFriendRequest(@Param('id') id: string, @Request() req: { user: { userId: number } }) {
    return this.usersService.sendFriendRequest(req.user.userId, +id);
  }
}
