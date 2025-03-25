import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ScheduleModule } from "@nestjs/schedule";
import { FinderModule } from "./services/finder/finder.module";
import { TelegramModule } from "./services/telegram/telegram.module";

@Module({
  imports: [
      ScheduleModule.forRoot(),
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
      }),
      FinderModule,
      TelegramModule,
  ],
})
export class AppModule {}
