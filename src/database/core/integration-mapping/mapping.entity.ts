import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { Expose } from 'class-transformer';

@Entity({ name: 'integration_mapping' })
export class IntegrationMapping extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryEntity })
    entity: IntegrationHistoryEntity;

    @Expose({ name: 'property_name' })
    @Column({ name: 'property_name' })
    propertyName: string;

    @Expose({ name: 'property_label' })
    @Column({ name: 'property_label' })
    propertyLabel: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    visible: boolean;
}
