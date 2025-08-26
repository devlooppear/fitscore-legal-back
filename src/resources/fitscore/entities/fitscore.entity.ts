import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'fitscores' })
export class FitScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'int' })
  performance: number;

  @Column({ type: 'int' })
  energy: number;

  @Column({ type: 'int' })
  culture: number;

  @Column({ type: 'float' })
  totalScore: number;

  @Column({
    type: 'enum',
    enum: [
      'FIT_ALTISSIMO',
      'FIT_APROVADO',
      'FIT_QUESTIONAVEL',
      'FORA_DO_PERFIL',
    ],
  })
  classification: string;

  @CreateDateColumn()
  createdAt: Date;
}
