import { randomUUID } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import type { PlanningStepData } from './entities/planning.entity';

const GOAL_TYPE_LABELS: Record<string, string> = {
  youth: '청년 지원금',
  abroad: '해외 준비',
  job: '취업 준비',
  nomad: '디지털 노마드',
};

const SYSTEM_PROMPT = `당신은 한국 사용자를 위한 생활 준비 에이전트 LifeFlow AI의 플래너입니다.
사용자가 입력한 목표를 바탕으로 실제로 실행 가능한 단계별 준비 절차를 만들어주세요.

규칙:
- 3~5단계로 구성하세요.
- 각 단계는 사용자가 오늘 바로 시작할 수 있을 만큼 구체적이어야 합니다.
- 사용자가 입력한 구체적인 상황(날짜, 기관명, 세부 사항 등)을 단계 설명에 반영하세요.
- actionLabel/actionUrl은 실제로 참고할 만한 공식 기관 웹사이트가 명확할 때만 채우고, 확실하지 않으면 생략하세요.
- title(플랜 제목)은 전체 플랜을 한 줄로 요약하는 제목입니다.
- 각 단계의 title은 반드시 그 단계에서 실제로 하는 행동을 설명하는 구체적인 한국어 문장이어야 합니다.
  "step1", "1단계", "단계 1" 같은 placeholder 텍스트는 절대 사용하지 마세요.
- title, description, actionLabel 등 모든 텍스트는 한국어로만 작성하세요. 중국어, 영어 등 다른 언어를 섞지 마세요.

다른 설명 없이 아래와 같은 JSON 형식만 출력하세요. 아래는 형식을 보여주는 예시일 뿐이며, 실제 내용은 사용자의 목표에 맞게 새로 작성해야 합니다:
{
  "title": "청년 지원금 신청 절차",
  "steps": [
    {
      "title": "자격 요건 확인하기",
      "description": "거주지, 소득 기준, 연령 조건을 확인해요.",
      "actionLabel": "청년정책 포털 바로가기",
      "actionUrl": "https://www.youthcenter.go.kr"
    },
    {
      "title": "신청 서류 준비하기",
      "description": "주민등록등본, 소득 증빙 서류 등을 미리 준비해요."
    }
  ]
}`;

type AiPlanResult = {
  title: string;
  steps: PlanningStepData[];
};

type ParsedStep = Omit<PlanningStepData, 'id' | 'order'>;
type ParsedPlan = { title: string; steps: ParsedStep[] };

const PLACEHOLDER_TITLE_PATTERN = /^(step\s*\d+|\d+\s*단계|단계\s*\d+)$/i;
const HAN_CHARACTER_PATTERN = /[一-鿿]/;

function isNonEmptyKoreanText(text: string | undefined): boolean {
  return !!text && text.trim().length > 0 && !HAN_CHARACTER_PATTERN.test(text);
}

/** Returns a human-readable reason if the plan fails quality checks, or null if it's valid. */
function validatePlan(parsed: ParsedPlan): string | null {
  if (!isNonEmptyKoreanText(parsed.title)) {
    return `플랜 제목이 비어있거나 한국어가 아님: "${parsed.title}"`;
  }
  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    return '단계가 비어있음';
  }
  for (const step of parsed.steps) {
    if (PLACEHOLDER_TITLE_PATTERN.test(step.title?.trim() ?? '')) {
      return `단계 제목이 placeholder임: "${step.title}"`;
    }
    if (!isNonEmptyKoreanText(step.title)) {
      return `단계 제목이 비어있거나 한국어가 아님: "${step.title}"`;
    }
    if (!isNonEmptyKoreanText(step.description)) {
      return `단계 설명이 비어있거나 한국어가 아님: "${step.description}"`;
    }
    if (step.actionLabel && HAN_CHARACTER_PATTERN.test(step.actionLabel)) {
      return `actionLabel에 한자가 섞임: "${step.actionLabel}"`;
    }
  }
  return null;
}

const MAX_ATTEMPTS = 2;

@Injectable()
export class PlanningAiService {
  private readonly logger = new Logger(PlanningAiService.name);
  private readonly model =
    process.env.NVIDIA_MODEL ?? 'meta/llama-3.3-70b-instruct';
  private readonly client: OpenAI | null = process.env.NVIDIA_API_KEY
    ? new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      })
    : null;

  async generatePlan(
    goalType: string,
    goalText: string,
  ): Promise<AiPlanResult | null> {
    if (!this.client) {
      this.logger.warn(
        'NVIDIA_API_KEY가 설정되지 않아 AI 플랜 생성을 건너뜁니다.',
      );
      return null;
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const parsed = await this.requestPlan(goalType, goalText);
      if (!parsed) {
        continue;
      }

      const invalidReason = validatePlan(parsed);
      if (!invalidReason) {
        return {
          title: parsed.title,
          steps: parsed.steps.map((step, index) => ({
            id: randomUUID(),
            order: index + 1,
            ...step,
          })),
        };
      }

      this.logger.warn(
        `AI 응답 품질 검증 실패 (시도 ${attempt}/${MAX_ATTEMPTS}): ${invalidReason}`,
      );
    }

    this.logger.error('최대 재시도 횟수를 초과해 템플릿으로 대체합니다.');
    return null;
  }

  private async requestPlan(
    goalType: string,
    goalText: string,
  ): Promise<ParsedPlan | null> {
    try {
      const response = await this.client!.chat.completions.create({
        model: this.model,
        max_tokens: 2048,
        temperature: 0.2,
        top_p: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `목표 유형: ${GOAL_TYPE_LABELS[goalType] ?? goalType}\n사용자 입력: ${goalText}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return null;
      }

      return JSON.parse(content) as ParsedPlan;
    } catch (error) {
      this.logger.error('AI 플랜 요청에 실패했어요.', error);
      return null;
    }
  }
}
