import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Null for events fired before login (Planning Loop is usable signed-out).
  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  @Column()
  name: string;

  @Column('simple-json', { nullable: true })
  payload: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;
}
