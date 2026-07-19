import { randomUUID } from 'crypto';

import type { PlanningStepData } from './entities/planning.entity';

type StepTemplate = Omit<PlanningStepData, 'id'>;

const STEP_TEMPLATES: Record<string, StepTemplate[]> = {
  abroad: [
    {
      order: 1,
      title: '취업비자/체류 자격 확인',
      description:
        '목적국의 취업비자 종류와 스폰서 요건, 필요 서류를 확인해요.',
    },
    {
      order: 2,
      title: '이력서/포트폴리오 현지화',
      description:
        '목적국 채용 시장에 맞춰 이력서와 포트폴리오를 업데이트해요.',
    },
    {
      order: 3,
      title: '채용 공고 스크리닝 및 면접 준비',
      description:
        '관심 있는 공고를 찾아 지원 마감일을 정리하고 면접을 준비해요.',
    },
  ],
  nomad: [
    {
      order: 1,
      title: '원격근무 가능 여부 확인',
      description: '현재 업무가 원격으로 가능한지, 회사 정책을 확인해요.',
    },
    {
      order: 2,
      title: '체류 국가 및 비자 조사',
      description: '디지털 노마드 비자 지원 국가를 조사해요.',
    },
    {
      order: 3,
      title: '업무 환경 세팅',
      description: '노트북, 통신, 결제 수단 등 원격 근무 환경을 준비해요.',
    },
  ],
};

export function generatePlanningSteps(goalType: string): PlanningStepData[] {
  const templates = STEP_TEMPLATES[goalType] ?? STEP_TEMPLATES.abroad;
  return templates.map((template) => ({ id: randomUUID(), ...template }));
}

const TITLE_TEMPLATES: Record<string, string> = {
  abroad: '해외 취업 준비 절차',
  nomad: '디지털 노마드 준비 절차',
};

export function generatePlanningTitle(goalType: string): string {
  return TITLE_TEMPLATES[goalType] ?? TITLE_TEMPLATES.abroad;
}
