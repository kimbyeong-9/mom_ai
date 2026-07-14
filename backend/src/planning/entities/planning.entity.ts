import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type PlanningStepData = {
  id: string;
  order: number;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
};

@Entity('plannings')
export class Planning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  goalType: string;

  @Column('text')
  goalText: string;

  @Column('simple-json')
  steps: PlanningStepData[];

  // False means the AI call failed/timed out and this plan is the generic
  // per-goalType template fallback — see PlanningService.create.
  @Column({ default: true })
  aiGenerated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
