# DareToDare Game

A fun and exciting party game with different tiers of dares!

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

## Configuration

The game uses two types of configuration:

### Client Configuration

The client-side Firebase configuration is included in the code and is safe to be public. This allows the game to work on any computer without additional setup.

### Admin Configuration (Optional)

If you need to run admin operations (like uploading new dares), you'll need to:

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your Google Cloud credentials in `.env` for admin operations
3. Set `ADMIN_ENABLED=true` in `.env`

Note: Admin configuration is only needed for administrative tasks, not for playing the game.

## Development

- Use `npm run dev` for development
- Use `npm run build` for production build
- Use `npm test` to run tests

## Security Notes

- Client-side Firebase configuration is public and safe to share
- Admin credentials in `.env` are private and should never be committed
- Keep the `.env` file secure and never share it
- Use `.env.example` as a template for admin variables

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details
