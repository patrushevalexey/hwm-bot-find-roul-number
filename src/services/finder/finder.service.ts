import axios from 'axios';
import { JSDOM } from 'jsdom';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
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
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    public async getTimeHhMmSs() {
        const now = new Date();
        const hours: string = String(now.getHours()).padStart(2, '0');
        const minutes: string = String(now.getMinutes()).padStart(2, '0');
        const seconds: string = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    public activateCron(): void {
        const job = this.schedulerRegistry.getCronJob('finderCronJob');

        if (job.running) {
            this.logger.log('Cron job already activated!');
            this.telegramService.sendMessage(process.env.TELEGRAM_CHAT_ID!, `Бот уже работает!`);
            return;
        }

        job.start();
        this.logger.log('Cron job ACTIVATED (задача будет выполняться)');
    }

    public deactivateCron(): void {
        const job = this.schedulerRegistry.getCronJob('finderCronJob');

        if (!job.running) {
            this.logger.log('Cron job already deactivated!');
            this.telegramService.sendMessage(process.env.TELEGRAM_CHAT_ID!, `Бот уже выключен!`);
            return;
        }

        job.stop();
        this.logger.log('Cron job DEACTIVATED (задача остановлена)');
    }

    // @Cron('15 */5 * * * *', { name: 'finderCronJob' })
    @Cron('*/10 * * * * *', { name: 'finderCronJob' })
    public async findXPathSpins(requiredSpinsCount: number = 249) {
        const job = this.schedulerRegistry.getCronJob('finderCronJob');

        if (!job.running) {
            this.logger.log('Cron job is inactive, skipping execution');
            return;
        }

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