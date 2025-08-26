import { Module } from '@nestjs/common';
import { FitScoreController } from './fitscore.controller';
import { FitScoreService } from './fitscore.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitScore } from './entities/fitscore.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FitScore, User])],
  controllers: [FitScoreController],
  providers: [FitScoreService]
})
export class FitscoreModule {}
