import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

export interface TaskEvent {
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED';
  taskId: number;
  taskTitle: string;
  oldStatus: string;
  newStatus: string;
  username: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null;
  private taskEventsSubject = new Subject<TaskEvent>();

  taskEvents$: Observable<TaskEvent> = this.taskEventsSubject.asObservable();

  connect(): void {
    if (this.client?.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ WebSocket connected');
        this.client?.subscribe('/topic/tasks', (message: IMessage) => {
          const event: TaskEvent = JSON.parse(message.body);
          this.taskEventsSubject.next(event);
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      },
      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }
}