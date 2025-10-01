# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname
    }
  }
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules
  }
})
```

## Frontend Configuration

### Environment Variables

The frontend uses the following environment variables for configuration:

#### App Configuration

- `VITE_APP_LOCALE`: Application locale (default: "en-US")
- `VITE_APP_CURRENCY`: Default currency (default: "USD")

#### API Configuration

- `VITE_API_BASE_URL`: Base URL for API communication including /api path (default: "http://localhost:3000/api")

### Development Server

The development server runs on port 5173 and proxies API requests to the backend server.

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Endpoints: http://localhost:3000/api

### API Client Configuration

The API client uses the complete base URL directly:

- Environment variable: `VITE_API_BASE_URL=http://localhost:3000/api`
- API client baseURL: `http://localhost:3000/api` (used directly)

This provides a cleaner configuration where the complete API endpoint is specified in the environment variable.
