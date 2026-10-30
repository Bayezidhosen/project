# StudioSpace — Peer-to-Peer Creative Studio Marketplace

**StudioSpace** is a complete, full-stack peer-to-peer marketplace where photographers, filmmakers, musicians, and creative producers can discover, explore, book, and host production spaces—ranging from high-fashion daylight infinity cyclorama stages to STC-65 soundproofed film soundstages, podcast recording lounges, and analog audio mastering suites.

---

## 🌟 Key Highlights & Engineering Features

1. **Anti-Collision Double-Booking Engine**:
   - High-precision time-interval overlap logic (`max(Start_A, Start_B) < min(End_A, End_B)`) protecting production sessions on the same date.
   - Prevents booking collisions with meaningful 409 Conflict rejection and instant feedback.
2. **JWT Security with HTTPOnly Cookie + Bearer Fallback**:
   - Protected studio publishing, editing, deletion, and booking reservation endpoints.
   - Server-enforced identity derivation (`req.user`) preventing client identity spoofing.
   - Strict resource ownership authorization (403 Forbidden on foreign studio mutation/cancellation).
3. **Dual-Theme 2026 Dark Luxury UI**:
   - Dark theme (`#10151F` canvas, `#181F2B` surface, `#293344` border, `#C5F36A` electric lime primary).
   - Light theme with Tailwind v4 `@custom-variant dark`.
   - Zero-pill metadata discipline, Space Grotesk & Plus Jakarta Sans typography.
4. **Interactive Studio Specs & Live Pricing Calculator**:
   - Dynamic real-time calculation: `(Hours × Hourly Rate) + Refundable Damage Deposit = Total`.
   - Date picker, call/wrap time selectors, and crew capacity validations.
5. **PDF Booking Invoice Generator**:
   - In-app printable and downloadable vector PDF invoices using `jspdf` with official invoice codes, billing breakdowns, deposit items, and host signatures.
6. **Host Space Management & Creator Review System**:
   - Host approval/completion/decline workflow for incoming reservations.
   - Star ratings and verified production review submissions.
   - Wishlist bookmarking with instant feedback.
7. **Resilient Dual-Mode Database Architecture**:
   - MongoDB Atlas Native Driver (`MongoClient`) with automated indexes when `MONGODB_URI` is provided.
   - Automatic fallback to an atomic JSON-persisted store in development sandboxes so the app runs without external credential dependencies.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas-Confetti, jsPDF
- **Backend**: Node.js, Express.js 4, TypeScript, tsx
- **Database**: MongoDB Native Driver 6.x (MongoDB Atlas compatible with collection indexes)
- **Authentication**: JWT, Signed HTTPOnly Cookies, Google OAuth flow simulation
- **Deployment**: Vite build pipeline, Express static middleware

---

## 📁 Project Architecture

```
/
├── server.ts                  # Unified full-stack server (Express API + Vite middlewares)
├── server/
│   ├── data/                  # Persisted data store
│   └── src/
│       ├── config/
│       │   └── mongodb.ts     # MongoDB Atlas client & database layer
│       ├── controllers/
│       │   ├── auth.controller.ts     # Register, Login, Google OAuth, Me
│       │   ├── studio.controller.ts   # Studio CRUD, Ownership validations
│       │   ├── booking.controller.ts  # Booking CRUD, Double-booking collision checks
│       │   └── extra.controller.ts    # Wishlist & Reviews
│       ├── middleware/
│       │   └── auth.middleware.ts     # JWT Cookie / Bearer verification
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── studio.routes.ts
│       │   ├── booking.routes.ts
│       │   └── extra.routes.ts
│       └── types/
│           └── index.ts
└── src/
    ├── assets/images/         # Generated high-resolution studio assets
    ├── components/
    │   ├── Navbar.tsx         # 3-Zone Top Bar with auth state & theme switch
    │   ├── Footer.tsx         # Responsive footer with X logo & newsletter
    │   ├── StudioCard.tsx     # Zero-pill metadata studio card with wishlist toggle
    │   ├── ConfirmModal.tsx   # Custom modal dialog (No browser alert/confirm)
    │   └── InvoiceModal.tsx   # PDF generator and printable invoice viewer
    ├── context/
    │   ├── AuthContext.tsx    # Session persistence across page reloads
    │   ├── ThemeContext.tsx   # Dark/Light theme coordinator
    │   └── ToastContext.tsx   # Sonner-style stacked toast alerts
    ├── pages/
    │   ├── HomePage.tsx       # Hero slider, featured studios, categories, how it works
    │   ├── ExplorePage.tsx    # Filterable grid, search, price range, sorting
    │   ├── StudioDetailPage.tsx # Image carousel, booking form, specs, reviews
    │   ├── LoginPage.tsx      # Credentials, Google Sign-in, Reviewer quick login
    │   ├── RegisterPage.tsx   # Strict password validator
    │   ├── DashboardPage.tsx  # Creator & host metrics hub
    │   ├── AddStudioPage.tsx  # Create studio with read-only host identity
    │   ├── EditStudioPage.tsx # Update studio with authorization check
    │   ├── MyListingsPage.tsx # Manage hosted stages with deletion dialog
    │   ├── MyBookingsPage.tsx # Sessions, status badges, cancel, invoice, host actions
    │   ├── WishlistPage.tsx   # Saved workspaces
    │   └── NotFoundPage.tsx   # Branded 404 handler
    ├── services/
    │   └── api.ts             # Typed REST API client
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

---

## 🔒 Security Architecture & Authorization

### 1. Identity Derivation
The server never trusts client-provided `hostEmail`, `userEmail`, or `userId` in JSON payloads.
Upon successful authentication, a JWT is signed with `JWT_SECRET` and attached via:
- Signed HTTPOnly cookie (`token`)
- Authorization header (`Bearer <token>`)

Protected operations inspect `req.user` verified from the cryptographically signed JWT:
- `POST /api/studios` auto-populates `hostName` and `hostEmail` from `req.user`.
- `PATCH /api/studios/:id` and `DELETE /api/studios/:id` reject foreign modification with `403 Forbidden`.
- `PATCH /api/bookings/:id/cancel` verifies that caller is either the client or the studio host.

### 2. Double-Booking Prevention Algorithm
Before creating or confirming a session:
```typescript
const conflicts = await db.findConflictingBookings(studioId, bookingDate, startTime, endTime);
if (conflicts.length > 0) {
  return res.status(409).json({
    success: false,
    message: `Schedule Conflict: This studio is already reserved on ${bookingDate} between ${conflicts[0].startTime} and ${conflicts[0].endTime}.`
  });
}
```

---

## 📡 REST API Reference

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (min 6 chars, 1 uppercase, 1 lowercase) |
| `POST` | `/api/auth/login` | Public | Sign in and receive HTTPOnly cookie + JWT |
| `POST` | `/api/auth/google` | Public | Google OAuth sign-in flow |
| `GET` | `/api/auth/me` | JWT | Get authenticated user profile |
| `POST` | `/api/auth/logout` | Public | Clear session cookie |
| `GET` | `/api/studios` | Public | Filter studios (category, price, search, sort, limit) |
| `GET` | `/api/studios/:id` | Public | Get studio details and creator reviews |
| `GET` | `/api/studios/host/me` | JWT | Get studios listed by current host |
| `POST` | `/api/studios` | JWT | Create new studio listing |
| `PATCH` | `/api/studios/:id` | Owner JWT | Update studio listing |
| `DELETE` | `/api/studios/:id` | Owner JWT | Permanently remove studio listing |
| `GET` | `/api/bookings` | JWT | Get authenticated user's reservations |
| `GET` | `/api/bookings/host` | Host JWT | Get reservations placed on host's studios |
| `POST` | `/api/bookings` | JWT | Reserve studio with collision detection |
| `PATCH` | `/api/bookings/:id/cancel`| JWT | Cancel reservation |
| `PATCH` | `/api/bookings/:id/status`| Host JWT | Host status change (confirmed, completed, cancelled) |
| `GET` | `/api/wishlist` | JWT | Get saved studio IDs |
| `POST` | `/api/wishlist/toggle` | JWT | Add or remove studio from wishlist |
| `POST` | `/api/reviews` | JWT | Post rating and review |

---

## 🔑 Examiner / Reviewer Test Credentials

For evaluation convenience, the Login page features a **Reviewer Quick Login** helper, or test credentials can be entered manually:

### Host Account:
- **Email**: `elena@aperturehouse.com`
- **Password**: `StudioHost2026!`
- **Role**: Studio Owner (owns "The Daylight Infinity Cyc Stage" & "Hudson Daylight Penthouse")

### Creator Account:
- **Email**: `creator@production.com`
- **Password**: `Director2026!`
- **Role**: Production Director & Client

### Quick Google Sign-In:
- Click **"Continue with Google"** on the login page to immediately sign in as a verified creator.

---

## ⚙️ Environment Variables

Create `.env` in the root directory:

```env
PORT=3000
APP_URL="http://localhost:3000"
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/studiospace?retryWrites=true&w=majority"
JWT_SECRET="studiospace_jwt_super_secret_key_2026_production"
BETTER_AUTH_SECRET="studiospace_better_auth_secret_token_9934"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
IMGBB_API_KEY="your_imgbb_api_key"
```

---

## 🚀 Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```
