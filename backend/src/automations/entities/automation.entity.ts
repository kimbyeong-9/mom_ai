import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type AutomationStatus = 'pending' | 'running' | 'succeeded' | 'failed';

@Entity('automations')
export class Automation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  planStepId: string;

  @Column()
  label: string;

  @Column()
  type: string;

  @Column({ default: 'pending' })
  status: AutomationStatus;

  @Column({ type: 'simple-json', nullable: true })
  result: Record<string, unknown> | null;

  // Only meaningful for the "job/remote-posting monitor" flavor of a
  // notification automation (see automations.service.ts) — a one-shot
  // deadline reminder never touches these.
  @Column({ default: 0 })
  matchCount: number;

  @Column({ default: 0 })
  newMatchCount: number;

  @Column({ type: 'datetime', nullable: true })
  lastCheckedAt: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  seenResultUrls: string[] | null;

  @CreateDateColumn()
  createdAt: Date;
}
