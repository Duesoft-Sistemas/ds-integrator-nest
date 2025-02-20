import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IntegrationHistoryService {
    @InjectRepository(IntegrationHistory)
    private readonly historyRepository: Repository<IntegrationHistory>;
}
