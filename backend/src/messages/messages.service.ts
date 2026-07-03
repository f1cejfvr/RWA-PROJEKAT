import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getTeamMessages(teamId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { team: { id: teamId } },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(content: string, sender: User, team: Team): Promise<Message> {
    const message = this.messageRepository.create({ content, sender, team });
    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Poruka nije pronađena');
    await this.messageRepository.delete(id);
  }
}
