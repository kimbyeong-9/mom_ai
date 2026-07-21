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
//
// countries/field/experience/workStyle hold Korean display labels (unused
// for search since real job platforms are English-language sites — kept only
// in case a future feature needs to show the profile back to the user).
// The *Codes/*Value siblings hold the raw wizard option ids (ISO country
// codes, English-ish kebab slugs) that buildEnglishJobQuery actually
// searches with — see search-query.util.ts.
export type SearchProfile = {
  countries: string[];
  field?: string;
  experience?: string;
  workStyle?: string;
  countryCodes?: string[];
  fieldValue?: string;
  experienceValue?: string;
  workStyleValue?: string;
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
