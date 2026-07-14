import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export type AuthProvider = 'google' | 'kakao';

// Kakao doesn't reliably provide email (requires a business-verified app to
// even request the scope), so email can't be a stable identity key. Accounts
// are identified by (provider, providerId) instead; email is best-effort
// contact info that may be null.
@Entity('users')
@Unique(['provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column()
  name: string;

  @Column()
  provider: AuthProvider;

  @Column()
  providerId: string;

  @CreateDateColumn()
  createdAt: Date;
}
