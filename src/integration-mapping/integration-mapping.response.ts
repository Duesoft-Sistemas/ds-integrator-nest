import { IntegrationMapping } from '@entities/integration-mapping/mapping.entity';
import { Expose } from 'class-transformer';

export class MappingObjectResponse<T> {
  key: string;

  label: string;

  @Expose()
  value: T;

  @Expose({ name: 'old_value ' })
  oldValue: T;

  @Expose({ name: 'is_divergence' })
  isDivergence?: boolean;

  constructor(source: IntegrationMapping, value: T, oldValue: T) {
    this.value = value;
    this.oldValue = oldValue;
    this.key = source.propertyName;
    this.label = source.propertyLabel;
    this.isDivergence = value !== oldValue;
  }
}
