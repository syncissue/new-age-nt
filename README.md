# DareToDare Game

A fun and exciting party game with different tiers of dares!

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Firebase and Google Cloud credentials in `.env`

3. Start the development server:

```bash
npx expo start
```

## Environment Variables

This project uses environment variables for sensitive configuration. To set up:

1. Create a `.env` file in the root directory
2. Add your configuration values:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   ...
   ```

Never commit the `.env` file or any files containing actual credentials!

## Development

- Use `npm run dev` for development
- Use `npm run build` for production build
- Use `npm test` to run tests

## Security Notes

- Never commit sensitive credentials or API keys
- Always use environment variables for secrets
- Keep the `.env` file secure and never share it
- Use `.env.example` as a template for required variables

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details
