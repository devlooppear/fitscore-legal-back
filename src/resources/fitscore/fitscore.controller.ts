import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FitScoreService } from './fitscore.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { logError } from '../../common/util/log.util';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fitscore')
export class FitScoreController {
  constructor(private fitScoreService: FitScoreService) {}

  @Post()
  async create(
    @Request() req,
    @Body() body: { performance: number; energy: number; culture: number },
  ) {
    try {
      return await this.fitScoreService.create(
        req.user.userId,
        body.performance,
        body.energy,
        body.culture,
        req.user.role,
      );
    } catch (error) {
      logError(error, 'FitScoreController.create');
      throw error;
    }
  }

  @Get('me')
  async getMyFitScore(@Request() req) {
    try {
      return await this.fitScoreService.findByUser(
        req.user.userId,
        req.user.role,
      );
    } catch (error) {
      logError(error, 'FitScoreController.getMyFitScore');
      throw error;
    }
  }

  @Get('candidates')
  async listCandidates(
    @Request() req,
    @Query('classification') classification?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    try {
      const currentPage = Number(page) || undefined;
      const currentSize = Number(size) || undefined;

      if (classification) {
        return await this.fitScoreService.findByClassification(
          classification,
          req.user.role,
        );
      }

      return await this.fitScoreService.findAll(
        req.user.role,
        currentPage,
        currentSize,
      );
    } catch (error) {
      logError(error, 'FitScoreController.listCandidates');
      throw error;
    }
  }

  @Get('candidates/:id')
  async getCandidate(@Request() req, @Param('id') id: number) {
    try {
      return await this.fitScoreService.findByUser(Number(id), req.user.role);
    } catch (error) {
      logError(error, 'FitScoreController.getCandidate');
      throw error;
    }
  }
}
