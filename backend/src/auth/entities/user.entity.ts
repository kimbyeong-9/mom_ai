import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type AuthProvider = 'google' | 'kakao';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  provider: AuthProvider;

  @Column()
  providerId: string;

  @CreateDateColumn()
  createdAt: Date;
}
