## Online Food Delivery Order Manager

Full‑stack TypeScript app to manage food delivery orders and automatically assign delivery to the nearest unpaid order.

### Tech Stack
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend**: React (TypeScript), Vite, Tailwind CSS
- **Deployment**: Render (backend API), Vercel (frontend)

---

### Features (per requirements)
- **Add Order**: Create a new order with `orderId`, `restaurantName`, `itemCount`, `isPaid`, `deliveryDistance`.
- **View All Orders**: Pageless table showing all orders.
- **Filter Orders**:
  - By **Paid / Unpaid**.
  - By **max distance** (≤ X km).
- **AssignDelivery(maxDistance)**:
  - Only considers **unpaid** orders.
  - Picks the **nearest** unpaid order (smallest `deliveryDistance`, then oldest `createdAt`).
  - If none found, returns **“No order available”**.

---

### Local Setup

#### 1. Prerequisites
- Node.js 18+
- A MongoDB connection string (e.g. MongoDB Atlas)

#### 2. Backend

```bash
cd backend
npm install

# set your Mongo URI (for local dev)
set MONGODB_URI=mongodb://localhost:27017/food-orders  # Windows PowerShell: $env:MONGODB_URI="..."

npm run dev
```

API runs by default on **`http://localhost:4000`**.

Key endpoints:
- `GET /api/orders` – list (optional `isPaid`, `maxDistance` query params)
- `POST /api/orders` – add order (JSON body)
- `POST /api/orders/assign-delivery` – assign nearest unpaid (JSON body: `{ maxDistance?: number }`)

#### 3. Frontend

```bash
cd frontend
npm install

# point frontend to API (for local dev)
set VITE_API_BASE=http://localhost:4000  # PowerShell: $env:VITE_API_BASE="http://localhost:4000"

npm run dev
```

App runs on **`http://localhost:5173`** by default.

---

### Deployment

#### Backend (Render)
1. Push this repo to GitHub.
2. In Render:
   - Create **New Web Service** from the repo.
   - **Root directory**: `backend`
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
   - Add env var **`MONGODB_URI`** with your MongoDB connection string.
3. After deploy, note the public URL, e.g. `https://food-order-manager-api.onrender.com`.

#### Frontend (Vercel)
1. Import the same GitHub repo in Vercel.
2. **Root directory**: `frontend`
3. **Build command**: `npm run build`
4. **Output directory**: `dist`
5. Add env var **`VITE_API_BASE`** pointing to the Render backend URL, e.g.
   - `VITE_API_BASE=https://food-order-manager-api.onrender.com`
6. Deploy – Vercel will give you the **live URL** for the UI.

---

### How the Assignment Logic Works
- **Filtering**:
  - Server builds a Mongo query based on `isPaid` and `maxDistance`.
  - Orders are sorted by `createdAt` descending when listing.
- **AssignDelivery**:
  - Filters orders by `isPaid: false` and optional `deliveryDistance <= maxDistance`.
  - Sorts by `deliveryDistance` ascending, then `createdAt` ascending.
  - Marks the selected order as **paid/assigned** and returns it.
  - If none match, responds with `404` and message **`No order available`**.

---

### Demo Flow (for 2‑minute video)
1. Open the deployed **frontend URL**.
2. Show **adding orders** with different distances and paid/unpaid flags.
3. Use the **filters**:
   - Toggle Paid / Unpaid.
   - Enter a max distance and apply.
4. Click **“Assign Delivery (nearest unpaid)”**:
   - Explain that it picks the smallest `deliveryDistance` among unpaid orders within optional max distance.
   - Show that the chosen order becomes **Paid / Assigned**.
5. Refresh to show consistency and mention MongoDB persistence.

