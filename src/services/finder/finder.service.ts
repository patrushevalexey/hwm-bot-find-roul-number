import axios from 'axios';
import { JSDOM } from 'jsdom';

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";

import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class FinderService {
    private readonly xPathSpins: string = '//*[@id="report_1"]/tbody/tr[1]/td[2]';
    private readonly xPathNumber: string = '//*[@id="report_1"]/tbody/tr[1]/td[1]/b/a';
    private readonly logger: Logger = new Logger(FinderService.name);

    constructor(
        private readonly telegramService: TelegramService,
        private readonly configService: ConfigService,
    ) {}

    public async getTimeHhMmSs() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    @Cron('15 */5 * * * *')
    public async findXPathSpins(requiredSpinsCount: number = 249) {
        this.logger.log('Загрузка страницы...');

        try {
            const response = await axios.get(this.configService.get('DAILY_DETAL_ROULETTE_PAGE')!);
            const html = response.data;

            const dom = new JSDOM(html);
            const document = dom.window.document;

            const resultSpins = document.evaluate(
                this.xPathSpins,
                document,
                null,
                dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
            );

            const resultsNumber = document.evaluate(
                this.xPathNumber,
                document,
                null,
                dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
            )

            const finderSpins: number = +(resultSpins.singleNodeValue)!.textContent!;
            const finderNumbers: number = +(resultsNumber.singleNodeValue)!.textContent!;

            if (finderSpins >= requiredSpinsCount) {
                this.logger.log(`${await this.getTimeHhMmSs()} - Найдено невыпадов: ${finderSpins} (у числа ${finderNumbers})\nПодробнее - https://daily.heroeswm.ru/roulette/detal.php!!!`);
                await this.telegramService.sendMessage(
                    this.configService.get('TELEGRAM_CHAT_ID')!,
                    `${await this.getTimeHhMmSs()} - Найдено невыпадов: ${finderSpins} (у числа ${finderNumbers})\nПодробнее - https://daily.heroeswm.ru/roulette/detal.php!!!`,
                );
            } else {
                this.logger.warn(`${await this.getTimeHhMmSs()} - Пока рекорд по невыпадениям - ${finderSpins} (у числа ${finderNumbers}), давай ждать ${requiredSpinsCount} невыпадов...`);
            }
        } catch (error) {
            this.logger.error(`${await this.getTimeHhMmSs()} - Ошибка при загрузке или парсинге страницы:`, error);
        }
    }
}