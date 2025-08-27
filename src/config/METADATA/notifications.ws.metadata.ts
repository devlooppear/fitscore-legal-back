export const NOTIFICATIONS_WS_METADATA = {
  namespace: '/notifications',
  events: {
    findAll: {
      description: 'Retorna todas as notificações paginadas',
      payload: '{ page?: number, size?: number }',
      response: 'PaginationDto<Notification>'
    },
    findByUser: {
      description: 'Retorna notificações de um usuário paginadas',
      payload: '{ userId: number, page?: number, size?: number }',
      response: 'PaginationDto<Notification>'
    },
    notifications: {
      description: 'Evento de resposta com notificações',
      payload: 'PaginationDto<Notification>'
    }
  }
};
