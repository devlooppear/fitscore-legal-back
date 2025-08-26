import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email único do usuário' })
  email: string;

  @ApiProperty({ example: 'Senha123!', description: 'Senha do usuário' })
  password: string;

  @ApiProperty({ 
    example: 'CANDIDATE', 
    description: 'Função do usuário na plataforma', 
    enum: ['CANDIDATE', 'RECRUITER'], 
    required: false 
  })
  role?: 'CANDIDATE' | 'RECRUITER';
}
