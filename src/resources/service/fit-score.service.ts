import { Injectable } from '@nestjs/common';
import { CreateFitScoreDto } from '../dto/create-fit-score.dto';
import { UpdateFitScoreDto } from '../dto/update-fit-score.dto';

@Injectable()
export class FitScoreService {
  create(createFitScoreDto: CreateFitScoreDto) {
    return 'This action adds a new fitScore';
  }

  findAll() {
    return `This action returns all fitScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fitScore`;
  }

  update(id: number, updateFitScoreDto: UpdateFitScoreDto) {
    return `This action updates a #${id} fitScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} fitScore`;
  }
}
