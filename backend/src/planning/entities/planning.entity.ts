import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  goalType: string;

  @Column('text')
  goalText: string;

  @Column('simple-json')
  steps: PlanningStepData[];

  @CreateDateColumn()
  createdAt: Date;
}
