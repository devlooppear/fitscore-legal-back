import { Module } from '@nestjs/common';
import { ScheduledReportService } from './scheduled-report.service';
import { ScheduledReportController } from './scheduled-report.controller';

@Module({
  controllers: [ScheduledReportController],
  providers: [ScheduledReportService],
})
export class ScheduledReportModule {}
