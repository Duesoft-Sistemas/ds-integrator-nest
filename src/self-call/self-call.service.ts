import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SelfCallService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout;

  constructor() {}

  async callSelf() {
    try {
      const url = 'https://ds-integrator-nest.onrender.com';
      await fetch(url);
    } catch (error) {
      console.error('Erro ao chamar a própria API:', error);
    }
  }

  onModuleInit() {
    this.intervalId = setInterval(() => this.callSelf(), 840000);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
