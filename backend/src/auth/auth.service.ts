import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Automation } from '../automations/entities/automation.entity';
import { Event } from '../events/entities/event.entity';
import { SavedPlan } from '../saved-plans/entities/saved-plan.entity';
import { User } from './entities/user.entity';
import type { OAuthProfile } from './strategies/oauth-profile.type';

type AuthResult = {
  accessToken: string;
  user: { id: string; email: string; name: string };
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SavedPlan)
    private readonly savedPlanRepository: Repository<SavedPlan>,
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: OAuthProfile): Promise<AuthResult> {
    let user = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          email: profile.email,
          name: profile.name,
          provider: profile.provider,
          providerId: profile.providerId,
        }),
      );
    } else if (
      user.provider !== profile.provider ||
      user.providerId !== profile.providerId
    ) {
      user.provider = profile.provider;
      user.providerId = profile.providerId;
      await this.userRepository.save(user);
    }

    return this.buildAuthResult(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.savedPlanRepository.delete({ userId });
    await this.automationRepository.delete({ userId });
    await this.eventRepository.delete({ userId });
    await this.userRepository.delete({ id: userId });
  }

  private buildAuthResult(user: User): AuthResult {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
