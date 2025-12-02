# Real-Time Data Pipeline (Node.js, Redis, BullMQ, WebSockets)

A complete real-time data processing pipeline built using **Node.js**,
**Redis**, **BullMQ**, **PostgreSQL**, and **WebSockets**.\
The system ingests data through an API, queues it, processes it in a
worker, stores it in PostgreSQL, and broadcasts updates in real-time.

## 1. Overview

### 1.1 Architecture

    Client
       |
       v
    REST API → BullMQ Queue → Worker → PostgreSQL
                         |
                         v
                   WebSocket Server

### 1.2 Technologies Used

  Component           Technology
  ------------------- -------------------
  Backend API         Node.js + Express
  Queue System        BullMQ
  Queue Backend       Redis 6.2
  Database            PostgreSQL
  Realtime Layer      WebSockets
  Background Worker   Node.js Worker

## 2. Project Structure

### 2.1 Folder Layout

    src/
    ├── controllers/
    │   ├── history.controller.js
    │   ├── ingest.controller.js
    │   └── stats.controller.js
    │
    ├── models/
    │   └── history.models.js
    │
    ├── routes/
    │   ├── history.routes.js
    │   ├── ingest.routes.js
    │   └── stats.routes.js
    │
    ├── db.js
    ├── queue.js
    ├── server.js
    ├── websocket.js
    └── worker.js

    .env

## 3. Setup Instructions

### 3.1 Install Dependencies

    npm install

### 3.2 Environment Variables

Create a `.env` file:

    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379

    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=realtime

### 3.3 Start Redis (Docker)

    docker run -d --name redis6 -p 6379:6379 redis:6.2

Test Redis:

    docker exec -it redis6 redis-cli PING

Expected:

    PONG

### 3.4 Create PostgreSQL Table

    CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      value NUMERIC,
      timestamp TIMESTAMP DEFAULT NOW()
    );

### 3.5 Start REST API Server

    node src/server.js

Expected:

    REST API running at http://localhost:3000
    Connected to Redis
    Connected to PostgreSQL

### 3.6 Start Worker Service

    node src/worker.js

Expected:

    Worker starting...
    Worker connected to PostgreSQL
    Worker connected to Redis
    Worker running...

## 4. API Usage

### 4.1 Ingest Data

**POST** `/api/ingest`

Body:

``` json
{ "value": 25 }
```

Response:

``` json
{
  "success": true,
  "message": "Data added to queue",
  "payload": { "value": 25 }
}
```

### 4.2 Get Stats

**GET** `/api/stats`

Response:

``` json
{
  "count": 12,
  "avg": 18.4,
  "min": 3,
  "max": 45,
  "latest": 25
}
```

### 4.3 Get History

**GET** `/api/history`

Response:

``` json
[
  { "value": 10, "timestamp": "2025-12-02T12:00:41Z" },
  { "value": 25, "timestamp": "2025-12-02T12:01:10Z" }
]
```

## 5. Realtime WebSocket Streaming

### 5.1 WebSocket Test Page

Create a file **test-ws.html**:

``` html
<script>
const ws = new WebSocket("ws://localhost:7000");

ws.onopen = () => console.log("WS connected");
ws.onmessage = (msg) => console.log("Realtime:", msg.data);
</script>
```

### 5.2 Expected Output

After sending:

``` json
{ "value": 50 }
```

Browser console:

    WS connected
    Realtime: {"type":"NEW_RECORD","payload":{"value":50}}
