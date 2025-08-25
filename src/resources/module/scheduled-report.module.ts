import { Module } from '@nestjs/common';
import { ScheduledReportService } from '../service/scheduled-report.service';
import { ScheduledReportController } from '../controller/scheduled-report.controller';

@Module({
  controllers: [ScheduledReportController],
  providers: [ScheduledReportService],
})
export class ScheduledReportModule {}
