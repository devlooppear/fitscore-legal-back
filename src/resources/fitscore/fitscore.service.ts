import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FitScoreClassification,
  FitScoreDescriptions,
} from '../../common/enum/classification.enum';
import { logError } from '../../common/util/log.util';
import { FitScore } from './entities/fitscore.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enum/role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../common/enum/notification.enum';
import {
  PaginationDto,
  PaginationMetaDto,
} from '../../common/dto/pagination.dto';
import { DEFAULT_PAGINATION } from '../../common/constants/pagination.const';
import { FitScoreResponseDto } from './dto/fitscore-response.dto';

@Injectable()
export class FitScoreService {
  constructor(
    @InjectRepository(FitScore)
    private fitScoreRepo: Repository<FitScore>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    userId: number,
    performance: number,
    energy: number,
    culture: number,
    userRole: UserRole,
  ) {
    try {
      if (userRole !== UserRole.CANDIDATE) {
        throw new ForbiddenException(
          'Access denied: only candidates can submit FitScore',
        );
      }

      const totalScore = (performance + energy + culture) / 3;

      let classification: FitScoreClassification;
      if (totalScore >= 80)
        classification = FitScoreClassification.FIT_ALTISSIMO;
      else if (totalScore >= 60)
        classification = FitScoreClassification.FIT_APROVADO;
      else if (totalScore >= 40)
        classification = FitScoreClassification.FIT_QUESTIONAVEL;
      else classification = FitScoreClassification.FORA_DO_PERFIL;

      const fitScore = this.fitScoreRepo.create({
        userId,
        performance,
        energy,
        culture,
        totalScore,
        classification,
      });

      const savedFitScore = await this.fitScoreRepo.save(fitScore);

      const description = FitScoreDescriptions[classification];

      await this.notificationsService.create(
        userId,
        NotificationType.RESULTADO,
        `Seu FitScore foi calculado: ${description} (Média: ${totalScore.toFixed(2)})`,
      );

      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'name', 'email', 'role', 'createdAt'],
      });

      return { ...savedFitScore, user };
    } catch (error) {
      logError(error, 'FitScoreService.create');
      throw error;
    }
  }

  async findByUser(userId: number, userRole: UserRole) {
    try {
      if (userRole !== UserRole.RECRUITER && userRole !== UserRole.CANDIDATE) {
        throw new ForbiddenException('Access denied');
      }

      const fitScore = await this.fitScoreRepo.findOne({ where: { userId } });

      if (!fitScore) return {};

      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'name', 'email', 'role', 'createdAt'],
      });

      return { ...fitScore, user };
    } catch (error) {
      logError(error, 'FitScoreService.findByUser');
      return {};
    }
  }

  async findAll(
    userRole: UserRole,
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
  ): Promise<PaginationDto<FitScoreResponseDto>> {
    if (userRole !== UserRole.RECRUITER) {
      throw new ForbiddenException(
        'Access denied: only recruiters can view all candidates',
      );
    }

    try {
      const [data, totalItems] = await this.fitScoreRepo.findAndCount({
        relations: ['user'],
        order: { id: 'DESC' },
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

      const sanitizedData: FitScoreResponseDto[] = data.map((fit) => {
        const { passwordHash, ...user } = fit.user || {};
        return {
          ...fit,
          classification: fit.classification as FitScoreClassification,
          user,
        };
      });

      return { data: sanitizedData, metadata };
    } catch (error) {
      logError(error, 'FitScoreService.findAll');

      throw error;
    }
  }

  async findByClassification(classification: string, userRole: UserRole) {
    try {
      if (userRole !== UserRole.RECRUITER) {
        throw new ForbiddenException(
          'Access denied: only recruiters can filter candidates',
        );
      }

      const result = await this.fitScoreRepo.find({
        where: { classification },
        relations: ['user'],
      });
      return result.length ? result : [];
    } catch (error) {
      logError(error, 'FitScoreService.findByClassification');
      return [];
    }
  }
}
