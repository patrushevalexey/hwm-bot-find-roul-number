import { Module } from "@nestjs/common";

import { FinderService } from "./finder.service";
import { TelegramServiceModule } from "../telegram/telegram.module";

@Module({
    imports: [TelegramServiceModule],
    providers: [FinderService],
    exports: [FinderService]
})
export class FinderServiceModule {}
