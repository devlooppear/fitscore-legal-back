import { Module } from '@nestjs/common';
import { FitScoreService } from '../service/fit-score.service';
import { FitScoreController } from '../controller/fit-score.controller';

@Module({
  controllers: [FitScoreController],
  providers: [FitScoreService],
})
export class FitScoreModule {}
