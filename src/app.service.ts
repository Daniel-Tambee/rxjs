import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Message } from './message.interface';

@Injectable()
export class AppService {
  /**
   * An RXJS Subject that may act as a bridge, e.g. between Controller(s) and Gateway(s)
   */
  private readonly message$$ = new Subject<Message>();

  /**
   * An RxJS Observable that anyone can subscribe to
   */
  readonly message$ = this.message$$.asObservable();

  /**
   * Send a message to all connected subscribers
   * @param value The message
   */
  sendMessage(value: Message): void {
    this.message$$.next(value);
  }

  /**
   *
   * @returns A friendly welcome message
   */
  getHello(): string {
    return 'Hello World!';
  }
}
