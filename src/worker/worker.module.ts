import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { WorkerService } from './worker.service';

@Module({
  providers: [WorkerService],
})
export class WorkerModule implements OnModuleInit, OnModuleDestroy {
  private intervalIds: NodeJS.Timeout[] = [];

  constructor(private readonly service: WorkerService) {}

  runCallSelf = () => {
    this.service.callSelf();
  };

  runClearIntegrationHistory = () => {
    this.service.clearIntegrationHistory();
  };

  onModuleInit() {
    this.intervalIds.push(setInterval(this.runCallSelf, 600000)); // 10min
    this.intervalIds.push(setInterval(this.runClearIntegrationHistory, 86400000)); // 1d
  }

  onModuleDestroy() {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });

    this.intervalIds = [];
  }
}
