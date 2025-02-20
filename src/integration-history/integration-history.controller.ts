import { Controller } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';

@Controller('integrations/history')
export class IntegrationHistoryController {
    constructor(private readonly historyService: IntegrationHistoryService) {}
}
