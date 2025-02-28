import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';

@Entity({ name: 'integration_mapping' })
export class IntegrationMapping extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryEntity })
    entity: IntegrationHistoryEntity;

    @Column({ name: 'property_name' })
    propertyName: string;

    @Column({ name: 'property_label' })
    propertyLabel: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    visible: boolean;
}
