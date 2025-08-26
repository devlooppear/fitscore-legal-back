import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Notification } from './entities/notification.entity';
import { UserRole } from '../../common/enum/role.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { DEFAULT_PAGINATION } from '../../common/constants/pagination.const';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(dto.userId, dto.type, dto.message);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<PaginationDto<Notification>> {
    const { userId, role } = req.user;

    const currentPage = page || DEFAULT_PAGINATION.PAGE;
    const currentSize = size || DEFAULT_PAGINATION.SIZE;

    if (role === UserRole.RECRUITER) {
      return this.notificationsService.findAll(currentPage, currentSize);
    } else {
      return this.notificationsService.findByUser(
        userId,
        currentPage,
        currentSize,
      );
    }
  }
}
