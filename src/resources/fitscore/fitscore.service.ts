import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitScoreClassification } from '../../common/enum/classification.enum';
import { logError } from '../../common/util/log.util';
import { FitScore } from './entities/fitscore.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enum/role.enum';

@Injectable()
export class FitScoreService {
  constructor(
    @InjectRepository(FitScore)
    private fitScoreRepo: Repository<FitScore>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

      return await this.fitScoreRepo.save(fitScore);
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

      const result = await this.fitScoreRepo.findOne({ where: { userId } });
      return result || {};
    } catch (error) {
      logError(error, 'FitScoreService.findByUser');
      return {};
    }
  }

  async findAll(userRole: UserRole) {
    try {
      if (userRole !== UserRole.RECRUITER) {
        throw new ForbiddenException(
          'Access denied: only recruiters can view all candidates',
        );
      }

      const result = await this.fitScoreRepo.find({ relations: ['user'] });
      return result.length ? result : [];
    } catch (error) {
      logError(error, 'FitScoreService.findAll');

      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error('Internal server error');
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
