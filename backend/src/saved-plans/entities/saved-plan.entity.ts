import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { PlanningStepData } from '../../planning/entities/planning.entity';

@Entity('saved_plans')
export class SavedPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  planningId: string;

  @Column()
  title: string;

  @Column()
  goalType: string;

  @Column('simple-json')
  steps: PlanningStepData[];

  @Column({ default: 0 })
  completedSteps: number;

  @Column()
  totalSteps: number;

  @CreateDateColumn()
  savedAt: Date;
}
