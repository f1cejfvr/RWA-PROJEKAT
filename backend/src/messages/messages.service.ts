import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private notificationsService: NotificationsService,
    private teamsService: TeamsService,
  ) {}

  async getTeamMessages(teamId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { team: { id: teamId } },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(content: string, sender: User, team: Team): Promise<Message> {
    const message = this.messageRepository.create({ content, sender, team });
    const saved = await this.messageRepository.save(message);

    const fullTeam = await this.teamsService.findOne(team.id);
    const recipients = fullTeam.members.filter((m) => m.id !== sender.id);

    for (const recipient of recipients) {
      await this.notificationsService.create(
        `${sender.username || sender.email} je poslao poruku u timu ${fullTeam.name}: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        'team_message',
        recipient,
        team.id,
      );
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Poruka nije pronađena');
    await this.messageRepository.delete(id);
  }
}
