export enum IntegrationStatus {
  active = 'active',
  stopped = 'stopped',
  critic = 'critic',
}

export const IntegrationStatusLabel: Record<IntegrationStatus, string> = {
  [IntegrationStatus.active]: 'Ativo',
  [IntegrationStatus.stopped]: 'Parado',
  [IntegrationStatus.critic]: 'Critico',
};
