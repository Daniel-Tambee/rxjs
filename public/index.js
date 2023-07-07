const { timer } = rxjs;
const { map, tap } = rxjs.operators;
const { webSocket } = rxjs.webSocket;

const host = new URL(window.location).host;

/**
 * An RxJS Subject that is able to send / receive data via a WebSocket connection
 * @see https://rxjs.dev/api/webSocket/webSocket
 */
const socket$$ = webSocket(`ws://${host}`);

/**
 * An output container
 */
const output = document.getElementById('output');

/**
 * Whenever data is received via the WebSocket, just add a timestamp, then display and log them
 */
socket$$
  .pipe(
    map((data) => ({ now: new Date(), ...data })),
    tap((data) => output.prepend(`${JSON.stringify(data, null, 2)},\n`)),
  )
  .subscribe({
    next: (data) => console.table(data),
  });

/**
 * Send an initial 'interest' for the 'message' channel
 * @see AppGateway#handleMessage()
 */
socket$$.next({ event: 'message', data: Math.ceil(Math.random() * 10) });

/**
 * Start a timer on a regular basis to send data to the 'ping' channel
 */
timer(5_000, 10_000)
  .pipe(
    /**
     * This creates the paylod
     */
    map((t) => {
      const payload = {
        event: 'ping',
        data: t,
      };
      return payload;
    }),
    /**
     * This actually sends the payload to the server
     */
    tap((payload) => socket$$.next(payload)),
  )
  /**
   * This insures that the timer starts to work
   */
  .subscribe();
