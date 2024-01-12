class EventService {
  sendEvent(type: string, payload: any, timestamp: number) {
    if (type === 'viewCard' && payload.log && payload.log !== '') {
      type = 'viewCardPromo';
    }
    const requestBody: any = { type, payload, timestamp };

    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send event');
        }
      })
      .catch((error) => {
        console.error('Error sending event:', error);
      });
  }
}
export const eventService = new EventService();
