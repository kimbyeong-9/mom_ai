import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AutomationsModule } from './automations/automations.module';
import { PlanningModule } from './planning/planning.module';
import { SavedPlansModule } from './saved-plans/saved-plans.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
