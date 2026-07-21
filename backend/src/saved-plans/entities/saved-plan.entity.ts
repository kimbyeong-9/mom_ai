import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type {
  PlanningStepData,
  SearchProfile,
} from '../../planning/entities/planning.entity';

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

  @Column({ type: 'simple-json', nullable: true })
  profile: SearchProfile | null;

  @Column({ default: 0 })
  completedSteps: number;

  @Column()
  totalSteps: number;

  @CreateDateColumn()
  savedAt: Date;
}
