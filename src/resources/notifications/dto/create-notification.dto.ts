import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../../common/enum/notification.enum';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
