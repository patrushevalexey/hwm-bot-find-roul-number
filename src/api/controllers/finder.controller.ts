import { Controller, Post } from '@nestjs/common';
import { FinderService } from "../../services/finder/finder.service";

@Controller('finder')
export class FinderController {
    constructor(private readonly finderService: FinderService) {}

    @Post('activate')
    activate() {
        this.finderService.activateCron();
        return { message: 'Finder service activated' };
    }

    @Post('deactivate')
    deactivate() {
        this.finderService.deactivateCron();
        return { message: 'Finder service deactivated' };
    }
}