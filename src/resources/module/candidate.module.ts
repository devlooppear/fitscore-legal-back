import { Module } from '@nestjs/common';
import { CandidateService } from '../service/candidate.service';
import { CandidateController } from '../controller/candidate.controller';
import { FitScoreModule } from './fit-score.module';
import { NotificationModule } from './notification.module';
import { ScheduledReportModule } from './scheduled-report.module';

@Module({
  controllers: [CandidateController],
  providers: [CandidateService],
  imports: [FitScoreModule, NotificationModule, ScheduledReportModule],
})
export class CandidateModule {}
