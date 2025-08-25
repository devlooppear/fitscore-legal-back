import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FitScoreService } from '../service/fit-score.service';
import { CreateFitScoreDto } from '../dto/create-fit-score.dto';
import { UpdateFitScoreDto } from '../dto/update-fit-score.dto';

@Controller('fit-score')
export class FitScoreController {
  constructor(private readonly fitScoreService: FitScoreService) {}

  @Post()
  create(@Body() createFitScoreDto: CreateFitScoreDto) {
    return this.fitScoreService.create(createFitScoreDto);
  }

  @Get()
  findAll() {
    return this.fitScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fitScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFitScoreDto: UpdateFitScoreDto) {
    return this.fitScoreService.update(+id, updateFitScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitScoreService.remove(+id);
  }
}
