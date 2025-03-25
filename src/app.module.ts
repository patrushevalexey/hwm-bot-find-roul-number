import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ScheduleModule } from "@nestjs/schedule";
import {FinderApiModule} from "./api/controllers/finder.module";
import {FinderServiceModule} from "./services/finder/finder.module";
import {TelegramServiceModule} from "./services/telegram/telegram.module";

@Module({
  imports: [
      ScheduleModule.forRoot(),
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
      }),
      FinderApiModule,
      FinderServiceModule,
      TelegramServiceModule,
  ],
})
export class AppModule {}
