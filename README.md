# Drain U Play

Drain U Play is a gamified Findom (Financial Domination) platform that transforms financial submission into a live, multiplayer board game experience.

## Architecture

- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons.
- **Backend:** Node.js (Express) + Socket.io + SQLite3 + Stripe.
- **Real-time:** Socket.io for game state sync and PeerJS for P2P video chat.

## Deployment

### Frontend (Vercel)
1. Set `VITE_BACKEND_URL` to your backend URL.
2. Deploy the `frontend/` directory.

### Backend (Railway)
1. Set `PORT` (default 3001).
2. Set `STRIPE_SECRET_KEY`.
3. Set `CORS_ORIGIN` to your frontend URL.
4. Mount a persistent volume for `drain_u_play.db`.
5. Deploy the `backend/` directory.

## Features
- Mandatory $4.44 Entry Fee (Stripe).
- Mandatory Facial Age Verification (FaceIO).
- Real-time multiplayer board game mechanics.
- Goddess SaaS Dashboard for multi-room management.
- P2P Video Chat (Cam-to-Cam).
- Solana/Crypto payment support with manual approval.
