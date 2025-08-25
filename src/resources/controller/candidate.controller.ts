import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CandidateService } from '../service/candidate.service';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGINATION } from '../../common/constants/pagination.const';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    return this.candidateService.create(createCandidateDto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }))
    page: number = DEFAULT_PAGINATION.PAGE,

    @Query('size', new ParseIntPipe({ optional: true }))
    size: number = DEFAULT_PAGINATION.SIZE,
  ): Promise<PaginationDto<Candidate>> {
    return this.candidateService.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Candidate> {
    return this.candidateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ): Promise<Candidate> {
    return this.candidateService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.candidateService.remove(id);
  }
}
