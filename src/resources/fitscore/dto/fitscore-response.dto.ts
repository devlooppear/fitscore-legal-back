import { FitScoreClassification } from '../../../common/enum/classification.enum';

export class FitScoreUserDto {
  id: number;
  name: string;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER';
  createdAt: Date;
}

export class FitScoreResponseDto {
  id: number;
  userId: number;
  performance: number;
  energy: number;
  culture: number;
  totalScore: number;
  classification: FitScoreClassification;
  createdAt: Date;
  user: FitScoreUserDto;
}
