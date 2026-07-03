import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getMyNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(content: string, type: string, recipient: User, referenceId?: number): Promise<Notification> {
    const notification = this.notificationRepository.create({
      content,
      type,
      recipient,
      referenceId,
    });
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.notificationRepository.update(id, { isRead: true });
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notifikacija nije pronađena');
    return notification;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update({ recipient: { id: userId } }, { isRead: true });
  }

  async remove(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }
}
