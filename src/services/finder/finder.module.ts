import { Module } from "@nestjs/common";

import { FinderService } from "./finder.service";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
    imports: [TelegramModule],
    providers: [FinderService],
    exports: [FinderService]
})
export class FinderModule {}