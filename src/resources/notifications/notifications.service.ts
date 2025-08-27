import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import {
  PaginationDto,
  PaginationMetaDto,
} from '../../common/dto/pagination.dto';
import { DEFAULT_PAGINATION } from '../../common/constants/pagination.const';
import { NotificationType } from '../../common/enum/notification.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(userId: number, type: NotificationType, message: string) {
    const notification = this.notificationRepo.create({
      userId,
      type,
      message,
    });
    return this.notificationRepo.save(notification);
  }

  async findByUser(
    userId: number,
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
  ): Promise<PaginationDto<Notification>> {
    const [data, totalItems] = await this.notificationRepo.findAndCount({
      where: { userId },
      order: { sentAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(totalItems / size);

    const metadata: PaginationMetaDto = {
      page,
      size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { data, metadata };
  }

  async findAll(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
  ): Promise<PaginationDto<Notification>> {
    const [data, totalItems] = await this.notificationRepo.findAndCount({
      order: { sentAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(totalItems / size);

    const metadata: PaginationMetaDto = {
      page,
      size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { data, metadata };
  }
}
