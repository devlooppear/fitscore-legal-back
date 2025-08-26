import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['CANDIDATE', 'RECRUITER'],
    default: 'CANDIDATE',
  })
  role: 'CANDIDATE' | 'RECRUITER';

  @CreateDateColumn()
  createdAt: Date;
}
