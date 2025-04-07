import {
  LiveData,
  PerformanceData,
  RiskParameters,
  StrategyConfig,
} from '@/types/dashboard';

interface WebSocketMessage {
  type: string;
  data: LiveData | PerformanceData | RiskParameters | StrategyConfig;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // 1 second
  private listeners: Map<string, ((data: WebSocketMessage['data']) => void)[]> =
    new Map();
  private wsUrl: string;

  constructor() {
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.notifyListeners(data.type, data.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't reconnect on error - the onclose handler will handle reconnection
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectTimeout * this.reconnectAttempts;
      console.log(
        `Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe(
    type: string,
    callback: (data: WebSocketMessage['data']) => void
  ) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(type: string, data: WebSocketMessage['data']) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  public send(data: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not open. Message not sent:', data);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
