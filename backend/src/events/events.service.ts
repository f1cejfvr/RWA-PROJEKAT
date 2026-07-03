import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Application } from './application.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async findAll(filters?: { category?: string; city?: string; type?: string }): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event').leftJoinAndSelect('event.organizer', 'organizer');

    if (filters?.category) {
      query.andWhere('event.category = :category', { category: filters.category });
    }
    if (filters?.city) {
      query.andWhere('event.city = :city', { city: filters.city });
    }
    if (filters?.type) {
      query.andWhere('event.type = :type', { type: filters.type });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event nije pronađen');
    return event;
  }

  async create(data: Partial<Event>, organizer: User): Promise<Event> {
    const event = this.eventRepository.create({ ...data, organizer });
    return this.eventRepository.save(event);
  }

  async update(id: number, data: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  async apply(eventId: number, applicant: User, message?: string): Promise<Application> {
    const event = await this.findOne(eventId);
    const application = this.applicationRepository.create({
      event,
      applicant,
      message,
    });
    return this.applicationRepository.save(application);
  }

  async getApplications(eventId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { event: { id: eventId } },
    });
  }

  async updateApplicationStatus(applicationId: number, status: string): Promise<Application> {
    await this.applicationRepository.update(applicationId, { status });
    const application = await this.applicationRepository.findOne({ where: { id: applicationId } });
    if (!application) throw new NotFoundException('Prijava nije pronadjena');
    return application;
  }
}
