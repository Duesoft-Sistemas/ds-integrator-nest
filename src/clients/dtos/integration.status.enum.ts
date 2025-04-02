export enum IntegrationStatus {
  all = 'all',
  active = 'active',
  stopped = 'stopped',
  critic = 'critic',
}

export const IntegrationStatusLabel: Partial<Record<IntegrationStatus, string>> = {
  [IntegrationStatus.active]: 'Ativo',
  [IntegrationStatus.stopped]: 'Parado',
  [IntegrationStatus.critic]: 'Critico',
};
