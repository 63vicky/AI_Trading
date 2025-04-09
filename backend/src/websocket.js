const WebSocket = require('ws');

// Store connected clients
const clients = new Set();

// Store current state
let currentState = {
  activeStrategies: 0,
  openPositions: 0,
  todayPnL: 0,
  totalExposure: 0,
  positions: [],
  orders: [],
  marketData: [],
  performance: {
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0,
    totalTrades: 0,
    averageWin: 0,
    averageLoss: 0,
  },
  risk: {
    circuitBreaker: true,
    maxDrawdown: 0.1,
    maxPositionSize: 100,
    maxLeverage: 2,
    stopLoss: 0.05,
    takeProfit: 0.1,
    currentExposure: 0,
    var: 0,
    beta: 0,
    volatility: 0,
  },
};

// Function to broadcast data to all connected clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Error broadcasting message:', error);
        clients.delete(client);
      }
    }
  });
};

// Setup WebSocket server
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({
    server,
    path: '/',
    clientTracking: true,
  });

  // Simulate market data updates
  setInterval(() => {
    try {
      // Update market data
      currentState.marketData.push({
        timestamp: new Date().toISOString(),
        price: Math.random() * 100 + 100, // Random price between 100 and 200
        volume: Math.floor(Math.random() * 1000),
      });

      // Keep only last 100 data points
      if (currentState.marketData.length > 100) {
        currentState.marketData.shift();
      }

      // Update performance metrics
      currentState.performance = {
        ...currentState.performance,
        totalReturn:
          currentState.performance.totalReturn + (Math.random() * 0.1 - 0.05),
        sharpeRatio: Math.random() * 2,
        winRate: Math.random() * 100,
      };

      // Broadcast live data update
      broadcast({
        type: 'liveData',
        data: {
          activeStrategies: currentState.activeStrategies,
          openPositions: currentState.openPositions,
          todayPnL: currentState.todayPnL,
          totalExposure: currentState.totalExposure,
          positions: currentState.positions,
          orders: currentState.orders,
          marketData: currentState.marketData,
        },
      });

      // Broadcast performance update every 5 seconds
      if (Date.now() % 5000 < 100) {
        broadcast({
          type: 'performance',
          data: currentState.performance,
        });
      }
    } catch (error) {
      console.error('Error in market data update interval:', error);
    }
  }, 1000);

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection from:', req.socket.remoteAddress);
    clients.add(ws);

    // Send initial state
    try {
      ws.send(
        JSON.stringify({
          type: 'initialState',
          data: currentState,
        })
      );
    } catch (error) {
      console.error('Error sending initial state:', error);
    }

    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const { type, data } = JSON.parse(message);
        console.log('Received message:', type);

        switch (type) {
          case 'strategyUpdate':
            currentState.activeStrategies++;
            broadcast({
              type: 'liveData',
              data: {
                activeStrategies: currentState.activeStrategies,
                openPositions: currentState.openPositions,
                todayPnL: currentState.todayPnL,
                totalExposure: currentState.totalExposure,
                positions: currentState.positions,
                orders: currentState.orders,
                marketData: currentState.marketData,
              },
            });
            break;

          case 'riskUpdate':
            currentState.risk = { ...currentState.risk, ...data };
            broadcast({
              type: 'risk',
              data: currentState.risk,
            });
            break;

          default:
            console.log('Unknown message type:', type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(
          JSON.stringify({
            type: 'error',
            data: { message: 'Invalid message format' },
          })
        );
      }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      console.log('Client disconnected:', code, reason);
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  return wss;
};

module.exports = {
  setupWebSocket,
  broadcast,
};
