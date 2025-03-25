import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const token = configService.get<string>('TELEGRAM_BOT_TOKEN');
                if (!token) {
                    throw new Error('TELEGRAM_BOT_TOKEN is not defined');
                }
                return { token };
            },
        }),
    ],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}