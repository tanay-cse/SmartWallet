# SmartWallet

A unified fintech app that combines a card vault, an AI card-recommendation assistant, in-app UPI/NFC payments, a forex & investment tracker, and a budget tracker.

---

## Folder Structure

```
smartwallet/
├── apps/
│   ├── backend/       # NestJS API server (Member A)
│   └── mobile/        # Expo / React Native app (Member B)
├── docs/
│   ├── SRS.md
│   ├── architecture.md
│   └── er-diagram.md
├── .github/
│   └── workflows/     # CI pipelines (added later)
├── .env.example
├── .gitignore
├── package.json       # npm workspace root
└── README.md
```

---

## Getting Started

> **Prerequisites:** Node.js ≥ 20, npm ≥ 10

1. **Clone the repo**

   ```bash
   git clone https://github.com/<org>/smartwallet.git
   cd smartwallet
   ```

2. **Install dependencies** (from the repo root)

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Fill in the required values in .env
   ```

4. **Start the backend** — see [`apps/backend/README.md`](apps/backend/README.md) once scaffolded.

5. **Start the mobile app** — see [`apps/mobile/README.md`](apps/mobile/README.md) once scaffolded.

---

## Documentation

| Document | Description |
|---|---|
| [`docs/SRS.md`](docs/SRS.md) | Software Requirements Specification |
| [`docs/architecture.md`](docs/architecture.md) | System architecture & tech stack |
| [`docs/er-diagram.md`](docs/er-diagram.md) | Entity-Relationship diagram |

---

## Contributing

Please read the contributing guidelines (coming soon) and open a pull request against `main`.

## License

MIT
