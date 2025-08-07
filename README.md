# 📦 RetailOps Cloud-Native Platform

This project is a cloud-native retail integration system designed for SmartRetail Inc. It provides real-time stock tracking, automated reordering from suppliers, and system observability using Azure services.

---

## 🧠 System Overview

RetailOps consists of:
- 3 Dockerized Microservices:
  - 🖥️ `frontend`: React dashboard to view products and stock.
  - 📦 `product-service`: Node.js API exposing product data.
  - 📦 `inventory-api`: Node.js API that manages stock levels and triggers reorders.
- Azure Function Apps:
  - ⚡ `Queue Trigger`: Processes low stock events and logs reorder actions.
  - ⚡ `HTTP Trigger`: Manually triggers reorder actions via HTTP call.
  - ⏰ `Timer Trigger`: Logs daily stock summaries at a scheduled time.
- Azure Storage Queue:
  - 📩 `stock-events`: Receives low stock messages for reordering.
- Azure Monitoring:
  - 🧭 Application Insights used for frontend telemetry and logs.

---

## ⚙️ Setup Instructions

### 🛠️ Manual Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/retailops-platform.git
   cd retailops-platform
   ```

2. **Start Docker Services**
   ```bash
   docker compose up -d --build
   ```

3. **Access Services**
   - Frontend: `http://<your_vm_ip>:3000`
   - Inventory API: `http://<your_vm_ip>:5000`
   - Product API: `http://<your_vm_ip>:6100`

4. **Azure Setup**
   - Create Storage Queue: `stock-events`
   - Deploy Azure Function App (via portal or `func azure functionapp publish`)
   - Add App Settings for Instrumentation Keys and Storage Connection

5. **Testing**
   - Update stock via:
     ```bash
     curl -X POST http://<ip>:5000/update \
     -H "x-api-key: retailops-secret-7Uj9@zX1" \
     -H "Content-Type: application/json" \
     -d '{"item":"apple", "quantity":6}'
     ```

---

## 🔁 Service Roles and Communication

| Service          | Role                                          | Communicates With         |
|------------------|-----------------------------------------------|----------------------------|
| `frontend`       | Displays product/stock UI                     | `product-service`, `inventory-api` |
| `product-service`| Serves product list                           | `frontend`                |
| `inventory-api`  | Handles stock updates and queues low stock    | Azure Queue (`stock-events`) |
| `queue trigger`  | Reorders low stock items                      | Logs via `context.log`    |
| `http trigger`   | Reorders items on demand                      | `inventory-api`           |
| `timer trigger`  | Logs daily stock snapshot                     | `inventory-api`           |

---

## 📬 Queue/Event Message Format

Stock messages sent to `stock-events` queue:
```json
{
  "item": "apple",
  "quantity": 6
}
```
Encoded as base64 before sending.

---

## 📈 Log Sample (Correlation ID)

A queue-triggered function processes:
```
[Information] 📦 Processing reorder for apple
[Information] 🔁 Quantity: 6
[Information] ✅ Reorder sent (simulated)
```

Telemetry is collected via Application Insights (Frontend + Backend).

---

## 🔐 Security Measures

- All API endpoints require:
  - `x-api-key: retailops-secret-7Uj9@zX1`
- Azure Functions use HTTPS endpoints.
- CORS is enabled only for:
  ```js
  ['http://localhost:3000', 'http://<your_vm_ip>:3000']
  ```
- Application Insights is configured with secure keys
- HTTPS endpoints are skipped (no custom domain or SSL binding)

---

## 📝 Notes

- CI/CD is skipped due to time and environment constraints.
- HTTPS is not implemented since no custom domain is used.
- This solution is deployable, event-driven, and observable.