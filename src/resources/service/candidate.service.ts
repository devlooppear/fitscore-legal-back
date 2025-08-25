import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { PaginationDto, PaginationMetaDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGINATION } from 'src/common/constants/pagination.const';
import { logError } from 'src/common/util/log.util';


@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    try {
      return await this.candidateRepository.save(this.candidateRepository.create(dto));
    } catch (err) {
      logError(err, 'CandidateService.create');
      throw new InternalServerErrorException('Failed to create candidate');
    }
  }

  async findAll(
    page = DEFAULT_PAGINATION.PAGE,
    size = DEFAULT_PAGINATION.SIZE,
  ): Promise<PaginationDto<Candidate>> {
    try {
      const [data, totalItems] = await this.candidateRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
      });

      const totalPages = Math.ceil(totalItems / size);
      const metadata: PaginationMetaDto = {
        page,
        size,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return { data, metadata };
    } catch (err) {
      logError(err, 'CandidateService.findAll');
      throw new InternalServerErrorException('Failed to fetch candidates');
    }
  }

  async findOne(id: number): Promise<Candidate> {
    try {
      const candidate = await this.candidateRepository.findOne({ where: { id } });
      if (!candidate) throw new NotFoundException(`Candidate #${id} not found`);
      return candidate;
    } catch (err) {
      logError(err, 'CandidateService.findOne');
      if (err.status) throw err;
      throw new InternalServerErrorException('Failed to fetch candidate');
    }
  }

  async update(id: number, dto: UpdateCandidateDto): Promise<Candidate> {
    try {
      const candidate = await this.findOne(id);
      Object.assign(candidate, dto);
      return await this.candidateRepository.save(candidate);
    } catch (err) {
      logError(err, 'CandidateService.update');
      if (err.status) throw err;
      throw new InternalServerErrorException('Failed to update candidate');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const candidate = await this.findOne(id);
      await this.candidateRepository.remove(candidate);
    } catch (err) {
      logError(err, 'CandidateService.remove');
      if (err.status) throw err;
      throw new InternalServerErrorException('Failed to remove candidate');
    }
  }
}
