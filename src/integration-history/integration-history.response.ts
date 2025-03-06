import * as _ from 'lodash';
import { IntegrationHistory } from '@entities/integration-history/history.entity';

export class HistoryDetailsResponse extends IntegrationHistory { 
    mapping: Array<any>;

    constructor(source: IntegrationHistory) {
        super();
        Object.assign(this, source);
    }
}