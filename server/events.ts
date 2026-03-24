type EventPayload = {
  type: string;
  ts: string;
  payload: any;
};

const clients = new Set<any>();
const history: EventPayload[] = [];

export function addClient(res: any) {
  clients.add(res);

  for (const item of history.slice(-50)) {
    res.write(`data: ${JSON.stringify(item)}\n\n`);
  }

  res.on("close", () => {
    clients.delete(res);
  });
}

export function emitEvent(type: string, payload: any) {
  const event: EventPayload = {
    type,
    ts: new Date().toISOString(),
    payload,
  };

  history.push(event);
  if (history.length > 500) history.shift();

  for (const client of clients) {
    client.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}
