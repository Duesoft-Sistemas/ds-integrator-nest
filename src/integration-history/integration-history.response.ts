import { IntegrationHistory } from '@entities/integration-history/history.entity';
import * as _ from 'lodash';

export class HistoryDetailsResponse extends IntegrationHistory {
  mapping: Array<any>;

  constructor(source: IntegrationHistory) {
    super();
    Object.assign(this, source);
  }
}
