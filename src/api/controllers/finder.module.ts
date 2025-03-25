import {Module} from "@nestjs/common";
import { FinderController } from "./finder.controller";
import { FinderServiceModule } from "../../services/finder/finder.module";

@Module({
    imports: [ FinderServiceModule ],
    controllers: [ FinderController ]
})
export class FinderApiModule {}