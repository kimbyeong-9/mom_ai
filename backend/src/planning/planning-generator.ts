import { randomUUID } from 'crypto';

import type { PlanningStepData } from './entities/planning.entity';

type StepTemplate = Omit<PlanningStepData, 'id'>;

const STEP_TEMPLATES: Record<string, StepTemplate[]> = {
  youth: [
    {
      order: 1,
      title: '자격 요건 확인',
      description: '거주지, 소득 기준, 연령 조건을 확인해요.',
      actionLabel: '청년정책 포털 바로가기',
      actionUrl: 'https://www.youthcenter.go.kr',
    },
    {
      order: 2,
      title: '신청 서류 준비',
      description: '주민등록등본, 소득 증빙 서류 등을 미리 준비해요.',
    },
    {
      order: 3,
      title: '온라인 신청서 제출',
      description: '기한 내에 온라인으로 신청서를 제출해요.',
    },
  ],
  abroad: [
    {
      order: 1,
      title: '비자/체류 자격 확인',
      description: '목적국의 비자 종류와 필요 서류를 확인해요.',
    },
    {
      order: 2,
      title: '항공권 및 숙소 예약',
      description: '출국일 기준 일정에 맞춰 예약을 진행해요.',
    },
    {
      order: 3,
      title: '출국 전 체크리스트 점검',
      description: '여권 유효기간, 보험, 환전 등을 점검해요.',
    },
  ],
  job: [
    {
      order: 1,
      title: '이력서/포트폴리오 정리',
      description: '지원 직무에 맞춰 이력서와 포트폴리오를 업데이트해요.',
    },
    {
      order: 2,
      title: '채용 공고 스크리닝',
      description: '관심 있는 공고를 찾아 지원 마감일을 정리해요.',
    },
    {
      order: 3,
      title: '면접 준비',
      description: '예상 질문과 회사별 답변을 준비해요.',
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
  const templates = STEP_TEMPLATES[goalType] ?? STEP_TEMPLATES.youth;
  return templates.map((template) => ({ id: randomUUID(), ...template }));
}

const TITLE_TEMPLATES: Record<string, string> = {
  youth: '청년 지원금 신청 절차',
  abroad: '해외 준비 절차',
  job: '취업 준비 절차',
  nomad: '디지털 노마드 준비 절차',
};

export function generatePlanningTitle(goalType: string): string {
  return TITLE_TEMPLATES[goalType] ?? TITLE_TEMPLATES.youth;
}
