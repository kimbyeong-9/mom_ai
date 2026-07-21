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

  // Per-step completion, not a running counter — a counter can't tell which
  // specific steps were done, so completing step 3 then step 1 looked
  // identical to completing steps 1 and 2 (the old completedSteps counter
  // this replaces also had no working UI wired to it at all — see
  // PATCH /saved-plans/steps/:stepId/toggle). Nullable so adding this column
  // to existing rows doesn't need a migration — treat null as [] on read.
  @Column({ type: 'simple-json', nullable: true })
  completedStepIds: string[] | null;

  @Column()
  totalSteps: number;

  @CreateDateColumn()
  savedAt: Date;
}
