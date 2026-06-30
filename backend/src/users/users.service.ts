import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
