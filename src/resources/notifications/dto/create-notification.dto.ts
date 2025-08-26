import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../../common/enum/notification.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 1, description: 'ID do usuário que receberá a notificação' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 'RESULTADO', enum: NotificationType, description: 'Tipo da notificação' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Seu FitScore foi FIT_ALTISSIMO (80)', description: 'Mensagem da notificação' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
