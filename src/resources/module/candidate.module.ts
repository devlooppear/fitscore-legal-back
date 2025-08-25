import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateService } from '../service/candidate.service';
import { CandidateController } from '../controller/candidate.controller';
import { FitScoreModule } from './fit-score.module';
import { NotificationModule } from './notification.module';
import { ScheduledReportModule } from './scheduled-report.module';
import { Candidate } from '../entities/candidate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate]),
    FitScoreModule,
    NotificationModule,
    ScheduledReportModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
