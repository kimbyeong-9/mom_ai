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

// Raw wizard answers (country names, not "IT·개발" collapsed into a prose
// sentence) — kept around so search grounding (Gemini's plan generation and
// later automation re-searches) can build a concise keyword query instead of
// parsing goalText back apart.
export type SearchProfile = {
  countries: string[];
  field?: string;
  experience?: string;
  workStyle?: string;
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

  @Column({ type: 'simple-json', nullable: true })
  profile: SearchProfile | null;

  // False means the AI call failed/timed out and this plan is the generic
  // per-goalType template fallback — see PlanningService.create.
  @Column({ default: true })
  aiGenerated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
