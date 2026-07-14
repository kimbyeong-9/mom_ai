import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async record(userId: string | null, dto: CreateEventDto): Promise<void> {
    await this.eventRepository.save(
      this.eventRepository.create({
        userId,
        name: dto.name,
        payload: dto.payload ?? null,
      }),
    );
  }
}
