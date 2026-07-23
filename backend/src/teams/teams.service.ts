import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { User } from '../users/user.entity';
import { TeamJoinRequest } from './team-join-request.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamJoinRequest)
    private joinRequestRepository: Repository<TeamJoinRequest>,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(filters?: { category?: string; city?: string }): Promise<Team[]> {
    const query = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.captain', 'captain')
      .leftJoinAndSelect('team.members', 'members');

    if (filters?.category) {
      query.andWhere('team.category = :category', { category: filters.category });
    }
    if (filters?.city) {
      query.andWhere('team.city = :city', { city: filters.city });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: { captain: true, members: true },
    });
    if (!team) throw new NotFoundException('Tim nije pronađen');
    return team;
  }

  async create(data: Partial<Team>, captain: User): Promise<Team> {
    const team = this.teamRepository.create({ ...data, captain, members: [captain] });
    return this.teamRepository.save(team);
  }

  async update(id: number, data: Partial<Team>): Promise<Team> {
    await this.teamRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.teamRepository.delete(id);
  }

  async requestToJoin(teamId: number, applicant: User): Promise<TeamJoinRequest> {
    const team = await this.findOne(teamId);

    const existing = await this.joinRequestRepository.findOne({
      where: { team: { id: teamId }, applicant: { id: applicant.id } },
    });

    if (existing) throw new BadRequestException('Već ste poslali zahtev za ovaj tim');

    const isMember = team.members?.some((m) => m.id === applicant.id);
    if (isMember) throw new BadRequestException('Već ste član ovog tima');

    const request = this.joinRequestRepository.create({ team, applicant });
    const saved = await this.joinRequestRepository.save(request);

    await this.notificationsService.create(
      `${applicant.username} želi da se pridruži timu ${team.name}`,
      'team_join_request',
      team.captain,
      teamId,
    );

    return saved;
  }

  async getJoinRequests(teamId: number): Promise<TeamJoinRequest[]> {
    return this.joinRequestRepository.find({
      where: { team: { id: teamId }, status: 'pending' },
    });
  }

  async respondToJoinRequest(requestId: number, status: string): Promise<TeamJoinRequest> {
    await this.joinRequestRepository.update(requestId, { status });
    const request = await this.joinRequestRepository.findOne({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Zahtev nije pronađen');

    if (status === 'accepted') {
      await this.addMember(request.team.id, request.applicant);
    }

    const statusText = status === 'accepted' ? 'prihvaćen' : 'odbijen';
    await this.notificationsService.create(
      `Tvoj zahtev za tim "${request.team.name}" je ${statusText}`,
      'team_join_request',
      request.applicant,
      request.team.id,
    );

    return request;
  }

  async addMember(teamId: number, user: User): Promise<Team> {
    const team = await this.findOne(teamId);
    team.members = [...(team.members || []), user];
    return this.teamRepository.save(team);
  }

  async removeMember(teamId: number, userId: number): Promise<Team> {
    const team = await this.findOne(teamId);
    team.members = team.members.filter((m) => m.id !== userId);
    return this.teamRepository.save(team);
  }
}
