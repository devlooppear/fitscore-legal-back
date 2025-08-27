import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';
import { NotificationsService } from './notifications.service';
import { logError } from '../../common/util/log.util';
import { UserRole } from '../../common/enum/role.enum';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ path: '/notifications' })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: WebSocket, req: any) {
    let token = '';
    if (req.headers['authorization']) {
      token = req.headers['authorization'];
    } else if (req.headers['sec-websocket-protocol']) {
      token = req.headers['sec-websocket-protocol'];
    } else if (req.url && req.url.includes('token=')) {
      token = decodeURIComponent(req.url.split('token=')[1].split('&')[0]);
    }
    if (token && token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      (client as any).user = payload;

      if (payload.role === 'RECRUITER') {
        this.notificationsService
          .findAll()
          .then((notifications) => {
            client.send(
              JSON.stringify({ event: 'notifications', data: notifications }),
            );
          })
          .catch(() => {
            client.send(
              JSON.stringify({
                event: 'notifications_error',
                data: { message: 'Erro ao buscar notificações.' },
              }),
            );
          });
      } else if (payload.role === 'CANDIDATE' || payload.role === 'CANDIDATO') {
        this.notificationsService
          .findByUser(payload.sub)
          .then((notifications) => {
            client.send(
              JSON.stringify({ event: 'notifications', data: notifications }),
            );
          })
          .catch(() => {
            client.send(
              JSON.stringify({
                event: 'notifications_error',
                data: { message: 'Erro ao buscar notificações.' },
              }),
            );
          });
      }
    } catch (err) {
      client.send(
        JSON.stringify({
          event: 'notifications_error',
          data: { message: 'Token inválido.' },
        }),
      );
      client.close();
    }
  }

  afterInit() {
    this.server.on('connection', (client: WebSocket) => {
      client.on('message', (data: any) => {
        this.handleMessage(client, data);
      });
    });
  }

  async handleMessage(client: WebSocket, data: any) {
    try {
      const user = (client as any).user;
      let msg;
      try {
        msg = typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        client.send(
          JSON.stringify({
            event: 'notifications_error',
            data: { message: 'Formato inválido.' },
          }),
        );
        return;
      }
      if (!msg.event) {
        client.send(
          JSON.stringify({
            event: 'notifications_error',
            data: { message: 'Evento não informado.' },
          }),
        );
        return;
      }
      if (msg.event === 'findAll') {
        if (!user || user.role !== UserRole.RECRUITER) {
          client.send(
            JSON.stringify({
              event: 'notifications_error',
              data: { message: 'Acesso negado.' },
            }),
          );
          return;
        }
        const { page, size } = msg.data || {};
        const notifications = await this.notificationsService.findAll(
          page,
          size,
        );
        client.send(
          JSON.stringify({ event: 'notifications', data: notifications }),
        );
      } else if (msg.event === 'findByUser') {
        const { userId, page, size } = msg.data || {};
        if (
          !user ||
          (user.role !== UserRole.RECRUITER && user.userId !== userId)
        ) {
          client.send(
            JSON.stringify({
              event: 'notifications_error',
              data: { message: 'Acesso negado.' },
            }),
          );
          return;
        }
        const notifications = await this.notificationsService.findByUser(
          userId,
          page,
          size,
        );
        client.send(
          JSON.stringify({ event: 'notifications', data: notifications }),
        );
      } else {
        client.send(
          JSON.stringify({
            event: 'notifications_error',
            data: { message: 'Evento desconhecido.' },
          }),
        );
      }
    } catch (error) {
      logError(error, 'NotificationsGateway.handleMessage');
      client.send(
        JSON.stringify({
          event: 'notifications_error',
          data: { message: 'Erro interno.' },
        }),
      );
    }
  }
}
