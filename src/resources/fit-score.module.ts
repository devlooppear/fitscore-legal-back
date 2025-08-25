import { Module } from '@nestjs/common';
import { FitScoreService } from './fit-score.service';
import { FitScoreController } from './fit-score.controller';

@Module({
  controllers: [FitScoreController],
  providers: [FitScoreService],
})
export class FitScoreModule {}
