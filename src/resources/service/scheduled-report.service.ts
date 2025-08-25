import { Injectable } from '@nestjs/common';
import { CreateScheduledReportDto } from '../dto/create-scheduled-report.dto';
import { UpdateScheduledReportDto } from '../dto/update-scheduled-report.dto';

@Injectable()
export class ScheduledReportService {
  create(createScheduledReportDto: CreateScheduledReportDto) {
    return 'This action adds a new scheduledReport';
  }

  findAll() {
    return `This action returns all scheduledReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduledReport`;
  }

  update(id: number, updateScheduledReportDto: UpdateScheduledReportDto) {
    return `This action updates a #${id} scheduledReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduledReport`;
  }
}
