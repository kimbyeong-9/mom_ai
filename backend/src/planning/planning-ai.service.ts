import { randomUUID } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

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
- actionLabel/actionUrl은 실제로 참고할 만한 공식 기관 웹사이트가 명확할 때만 채우고, 확실하지 않으면 비워두세요.
- title은 전체 플랜을 한 줄로 요약하는 제목입니다 (예: "청년 지원금 신청 절차").`;

type AiPlanResult = {
  title: string;
  steps: PlanningStepData[];
};

const RESPONSE_SCHEMA = {
  type: 'object' as const,
  properties: {
    title: { type: 'string' as const },
    steps: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          title: { type: 'string' as const },
          description: { type: 'string' as const },
          actionLabel: { type: 'string' as const },
          actionUrl: { type: 'string' as const },
        },
        required: ['title', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'steps'],
  additionalProperties: false,
};

@Injectable()
export class PlanningAiService {
  private readonly logger = new Logger(PlanningAiService.name);
  private readonly client: Anthropic | null = process.env.ANTHROPIC_API_KEY
    ? new Anthropic()
    : null;

  async generatePlan(
    goalType: string,
    goalText: string,
  ): Promise<AiPlanResult | null> {
    if (!this.client) {
      this.logger.warn(
        'ANTHROPIC_API_KEY가 설정되지 않아 AI 플랜 생성을 건너뜁니다.',
      );
      return null;
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `목표 유형: ${GOAL_TYPE_LABELS[goalType] ?? goalType}\n사용자 입력: ${goalText}`,
          },
        ],
        output_config: {
          format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
        },
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        return null;
      }

      const parsed = JSON.parse(textBlock.text) as {
        title: string;
        steps: Array<Omit<PlanningStepData, 'id' | 'order'>>;
      };

      return {
        title: parsed.title,
        steps: parsed.steps.map((step, index) => ({
          id: randomUUID(),
          order: index + 1,
          ...step,
        })),
      };
    } catch (error) {
      this.logger.error('AI 플랜 생성에 실패해 템플릿으로 대체합니다.', error);
      return null;
    }
  }
}
