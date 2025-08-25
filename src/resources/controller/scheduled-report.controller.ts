import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduledReportService } from '../service/scheduled-report.service';
import { CreateScheduledReportDto } from '../dto/create-scheduled-report.dto';
import { UpdateScheduledReportDto } from '../dto/update-scheduled-report.dto';

@Controller('scheduled-report')
export class ScheduledReportController {
  constructor(private readonly scheduledReportService: ScheduledReportService) {}

  @Post()
  create(@Body() createScheduledReportDto: CreateScheduledReportDto) {
    return this.scheduledReportService.create(createScheduledReportDto);
  }

  @Get()
  findAll() {
    return this.scheduledReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduledReportDto: UpdateScheduledReportDto) {
    return this.scheduledReportService.update(+id, updateScheduledReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledReportService.remove(+id);
  }
}
