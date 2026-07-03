import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
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
