import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AutomationsModule } from './automations/automations.module';
import { EventsModule } from './events/events.module';
import { PlanningModule } from './planning/planning.module';
import { SavedPlansModule } from './saved-plans/saved-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH ?? './data/lifeflow.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PlanningModule,
    SavedPlansModule,
    AutomationsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
