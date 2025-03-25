import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Telegraf } from 'telegraf';


@Injectable()
export class TelegramService {
    private readonly bot: Telegraf;

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN is not defined');
        }
        this.bot = new Telegraf(token);
    }

    public async sendMessage(chatId: string, message: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, message);
    }
}