import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}
