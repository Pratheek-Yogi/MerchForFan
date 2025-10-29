# React + Express.js Project

This project combines React.js frontend with Express.js backend in a full-stack application.

## Project Structure

```
ProjectIII/
├── client/           # React frontend code
│   ├── App.js       # Main React component
│   └── index.js     # React entry point
├── server/          # Express.js backend
│   └── index.js     # Server configuration and routes
├── public/          # Static files and built React app
│   └── index.html   # HTML template
├── package.json     # Dependencies and scripts
├── webpack.config.js # Webpack configuration
└── .babelrc         # Babel configuration
```

## Features

- ✅ React.js frontend with modern hooks
- ✅ Express.js backend with API routes
- ✅ CORS enabled for cross-origin requests
- ✅ Webpack for bundling and development
- ✅ Babel for ES6+ transpilation
- ✅ Hot reloading in development mode

## Available Scripts

- `npm start` - Start the Express.js server only
- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the Express.js server
- `npm run client` - Start only the React development server
- `npm run build` - Build React app for production

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the React App
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
```

The application will be available at `http://localhost:5000`

### 4. Development Mode (Optional)
For development with hot reloading:
```bash
npm run dev
```

This will start:
- Express server on `http://localhost:5000`
- React dev server on `http://localhost:3000`

## API Endpoints

- `GET /api/hello` - Returns a welcome message
- `GET /api/users` - Returns a list of sample users

## Technologies Used

- **Frontend**: React.js, React DOM
- **Backend**: Express.js, CORS
- **Build Tools**: Webpack, Babel
- **Development**: Webpack Dev Server, Concurrently

## Next Steps

You can now:
1. Add more React components in the `client/` folder
2. Create additional API routes in `server/index.js`
3. Add a database connection (MongoDB, PostgreSQL, etc.)
4. Implement authentication and user management
5. Add styling with CSS frameworks or styled-components
