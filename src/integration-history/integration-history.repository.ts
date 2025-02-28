import { IntegrationHistory } from "@entities/integration-history/history.entity";
import { IntegrationHistoryType } from "@entities/integration-history/history.type.enum";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Raw, Repository } from "typeorm";

@Injectable()
export class IntegrationHistoryRepository extends Repository<IntegrationHistory> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(IntegrationHistory, dataSource.createEntityManager());
    }

    async listByClient(clientIntegrationId: number, type?: IntegrationHistoryType): Promise<IntegrationHistory[]> {
        return await this.find({
            where: {
                clientIntegrationId,
                type: type ?? Raw(() => 'true'),
            }
        })
    }

    async listByType(type: IntegrationHistoryType): Promise<IntegrationHistory[]> {
        return await this.find({ where: { type } });
    }
}