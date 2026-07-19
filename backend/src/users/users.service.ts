import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { FriendRequest } from './friend-request.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Korisnik nije pronađen');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { friends: true },
    });
    const friend = await this.findOne(friendId);
    if (!user) throw new NotFoundException('Korisnik nije pronađen');
    user.friends = [...(user.friends || []), friend];
    return this.userRepository.save(user);
  }

  async getFriends(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { friends: true },
    });
    if (!user) throw new NotFoundException('Korisnik nije pronađen');
    return user.friends;
  }

  async sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
    const existing = await this.friendRequestRepository.findOne({
      where: { sender: { id: senderId }, receiver: { id: receiverId } },
    });
    if (existing) throw new Error('Zahtev već postoji');

    const sender = await this.findOne(senderId);
    const receiver = await this.findOne(receiverId);

    const request = this.friendRequestRepository.create({ sender, receiver });
    return this.friendRequestRepository.save(request);
  }

  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' },
    });
  }

  async respondToFriendRequest(requestId: number, status: string): Promise<FriendRequest> {
    await this.friendRequestRepository.update(requestId, { status });
    const request = await this.friendRequestRepository.findOne({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Zahtev nije pronađen');

    if (status === 'accepted') {
      await this.addFriend(request.sender.id, request.receiver.id);
    }

    return request;
  }

  async getSentFriendRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: { sender: { id: userId } },
    });
  }
}
