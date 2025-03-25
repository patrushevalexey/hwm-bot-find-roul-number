import {Module} from "@nestjs/common";
import {FinderModule} from "./finder/finder.module";
import {TelegramModule} from "./telegram/telegram.module";

@Module({
    imports: [
        FinderModule,
        TelegramModule,
    ]
})
export class ServicesModule {}