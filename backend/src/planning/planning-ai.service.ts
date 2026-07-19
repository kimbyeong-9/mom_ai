import { randomUUID } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import type { PlanningStepData } from './entities/planning.entity';

const GOAL_TYPE_LABELS: Record<string, string> = {
  abroad: '해외 취업',
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
  "title": "호주 취업 비자 준비 절차",
  "steps": [
    {
      "title": "취업비자 스폰서 요건 확인하기",
      "description": "482 Skills in Demand 비자의 스폰서 기업 요건과 필요 서류를 확인해요.",
      "actionLabel": "호주 이민성(Home Affairs) 바로가기",
      "actionUrl": "https://immi.homeaffairs.gov.au"
    },
    {
      "title": "영문 이력서 준비하기",
      "description": "현지 채용 시장 기준에 맞춰 이력서와 포트폴리오를 정리해요."
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
  // NVIDIA's free-tier NIM catalog is shared across every community user of
  // a given model, so reliability swings with demand — measured ~40% of
  // calls timing out even after switching off the fully-dead 3.3-70b model.
  // Moved to Gemini's free tier (Google's own serving infra, reached via its
  // OpenAI-compatible endpoint so the `openai` SDK still works unchanged).
  // gemini-2.5-flash/-lite are 404 ("no longer available to new users") and
  // gemini-2.0-flash* have a hard 0 free-tier quota on newly created API
  // keys — 3.1-flash-lite is the current-gen model this key actually has
  // free quota for (verified 5/5 successful calls, both raw and end-to-end).
  private readonly model = process.env.GEMINI_MODEL ?? 'gemini-3.1-flash-lite';
  private readonly client: OpenAI | null = process.env.GEMINI_API_KEY
    ? new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        timeout: 30_000,
        maxRetries: 0,
      })
    : null;

  async generatePlan(
    goalType: string,
    goalText: string,
  ): Promise<AiPlanResult | null> {
    if (!this.client) {
      this.logger.warn(
        'GEMINI_API_KEY가 설정되지 않아 AI 플랜 생성을 건너뜁니다.',
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
