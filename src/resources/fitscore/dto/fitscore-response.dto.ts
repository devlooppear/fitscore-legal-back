import { ApiProperty } from '@nestjs/swagger';
import { FitScoreClassification } from '../../../common/enum/classification.enum';

export class FitScoreUserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'CANDIDATE', enum: ['CANDIDATE', 'RECRUITER'], description: 'Função do usuário' })
  role: 'CANDIDATE' | 'RECRUITER';

  @ApiProperty({ example: '2025-08-26T10:00:00Z', description: 'Data de criação do usuário' })
  createdAt: Date;
}

export class FitScoreResponseDto {
  @ApiProperty({ example: 1, description: 'ID do FitScore' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID do usuário associado' })
  userId: number;

  @ApiProperty({ example: 80, description: 'Desempenho do candidato (0–100)' })
  performance: number;

  @ApiProperty({ example: 70, description: 'Energia do candidato (0–100)' })
  energy: number;

  @ApiProperty({ example: 90, description: 'Cultura do candidato (0–100)' })
  culture: number;

  @ApiProperty({ example: 80, description: 'Pontuação total calculada' })
  totalScore: number;

  @ApiProperty({ example: 'FIT_ALTISSIMO', enum: FitScoreClassification, description: 'Classificação do FitScore' })
  classification: FitScoreClassification;

  @ApiProperty({ example: '2025-08-26T12:00:00Z', description: 'Data de criação do FitScore' })
  createdAt: Date;

  @ApiProperty({ type: () => FitScoreUserDto, description: 'Informações do usuário associado' })
  user: FitScoreUserDto;
}
