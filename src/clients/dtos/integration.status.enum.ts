export enum IntegrationStatus {
  all = 'all',
  active = 'active',
  stoped = 'stoped',
  critic = 'critic',
}

export const IntegrationStatusLabel: Partial<Record<IntegrationStatus, string>> = {
  [IntegrationStatus.active]: 'Ativo',
  [IntegrationStatus.stoped]: 'Parado',
  [IntegrationStatus.critic]: 'Critico',
};
