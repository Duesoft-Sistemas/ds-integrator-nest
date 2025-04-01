import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class SelfCallService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout;

  constructor() {}

  async callSelf() {
    const url = 'https://ds-integrator-nest.onrender.com/integrations';
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Resposta da API:', data);
    } catch (error) {
      console.error('Erro ao chamar a própria API:', error);
    }
  }

  onModuleInit() {
    console.log('Iniciando chamadas automáticas a cada 14 minutos...');
    this.intervalId = setInterval(() => this.callSelf(), 840000);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Parando chamadas automáticas.');
    }
  }
}
