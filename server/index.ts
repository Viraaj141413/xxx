import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerChatRoutes } from "./chat-routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';
import path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable trust proxy for deployment environments
app.set('trust proxy', 1);

// Auto-generate essential Replit project files on startup
function generateEssentialFiles() {
  const projectRoot = process.cwd();
  
  // Create package.json if it doesn't exist
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      "name": "replit-project",
      "version": "1.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite --host 0.0.0.0 --port 5000",
        "build": "vite build",
        "preview": "vite preview --host 0.0.0.0 --port 5000"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react": "^4.0.0",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.24",
        "tailwindcss": "^3.3.0",
        "typescript": "^5.0.0",
        "vite": "^4.4.0"
      }
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Generated package.json');
  }

  // Create index.ts in root
  const indexTsPath = path.join(projectRoot, 'index.ts');
  if (!fs.existsSync(indexTsPath)) {
    const indexContent = `// Main entry point for the application
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Replit!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Server running on http://0.0.0.0:\${PORT}\`);
});
`;
    fs.writeFileSync(indexTsPath, indexContent);
    console.log('📄 Generated index.ts');
  }

  // Create vite.config.ts
  const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
  if (!fs.existsSync(viteConfigPath)) {
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
`;
    fs.writeFileSync(viteConfigPath, viteConfig);
    console.log('⚡ Generated vite.config.ts');
  }

  // Create tailwind.config.js
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
  if (!fs.existsSync(tailwindConfigPath)) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    console.log('🎨 Generated tailwind.config.js');
  }

  // Create postcss.config.js
  const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
  if (!fs.existsSync(postcssConfigPath)) {
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('📮 Generated postcss.config.js');
  }

  // Create tsconfig.json
  const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfig = {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('🔧 Generated tsconfig.json');
  }

  // Create src directory with main files
  const srcDir = path.join(projectRoot, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
    
    // Create App.tsx
    const appTsxContent = `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Replit!
        </h1>
        <p className="text-lg text-gray-600">
          Your app is running successfully.
        </p>
      </div>
    </div>
  )
}

export default App
`;
    fs.writeFileSync(path.join(srcDir, 'App.tsx'), appTsxContent);
    
    // Create main.tsx
    const mainTsxContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
    fs.writeFileSync(path.join(srcDir, 'main.tsx'), mainTsxContent);
    
    // Create index.css
    const indexCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
    fs.writeFileSync(path.join(srcDir, 'index.css'), indexCssContent);
    
    // Create App.css
    const appCssContent = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
`;
    fs.writeFileSync(path.join(srcDir, 'App.css'), appCssContent);
    
    console.log('📁 Generated src directory with React files');
  }

  // Create index.html
  const indexHtmlPath = path.join(projectRoot, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Replit App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('🌐 Generated index.html');
  }

  console.log('✅ All essential Replit files generated successfully!');
}

// Generate files on startup
console.log('🔄 Generating essential Replit project files...');
generateEssentialFiles();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Professional file creation endpoint for AI-generated files
app.post('/api/files/create', async (req, res) => {
  try {
    const { fileName, content, language } = req.body;

    if (!fileName || content === undefined) {
      return res.status(400).json({ error: 'fileName and content are required' });
    }

    // Create AI-generated files in dedicated directory
    const aiGenDir = path.join(process.cwd(), 'ai-generated');
    if (!fs.existsSync(aiGenDir)) {
      fs.mkdirSync(aiGenDir, { recursive: true });
    }
    
    const filePath = path.join(aiGenDir, fileName);

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file with professional formatting
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`📄 AI Generated file: ${fileName}`);
    res.json({ success: true, fileName, path: filePath });
  } catch (error) {
    console.error('Error creating AI file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// Preview endpoint for ai-generated files
app.get('/preview/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'ai-generated', filename);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).send('Preview error');
  }
});

// Professional file listing endpoint - starts with zero files
app.get('/api/files/list', async (req, res) => {
  try {
    // Start with completely empty project - professional clean slate
    const files: any = {};
    
    // Only scan for AI-generated files, ignore all system files
    const projectDir = path.join(process.cwd(), 'ai-generated');
    
    if (fs.existsSync(projectDir)) {
      const scanDirectory = (dir: string, relativePath = '') => {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          // Only include AI-generated files
          if (item.startsWith('.')) continue;

          const fullPath = path.join(dir, item);
          const relativeFilePath = relativePath ? path.join(relativePath, item) : item;
          const stat = fs.statSync(fullPath);

          if (stat.isFile()) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const ext = path.extname(item).toLowerCase();
              let type = 'text';

              if (ext === '.html') type = 'html';
              else if (ext === '.css') type = 'css';
              else if (ext === '.js' || ext === '.jsx') type = 'javascript';
              else if (ext === '.ts' || ext === '.tsx') type = 'typescript';
              else if (ext === '.py') type = 'python';
              else if (ext === '.json') type = 'json';

              files[relativeFilePath] = { content, type };
            } catch (error) {
              // Skip files that can't be read
            }
          } else if (stat.isDirectory()) {
            scanDirectory(fullPath, relativeFilePath);
          }
        }
      };

      scanDirectory(projectDir);
    }
    
    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.json({ files: {} }); // Always return empty object for clean start
  }
});

(async () => {
  // Register API routes BEFORE any other middleware to ensure they work
  registerChatRoutes(app);
  
  // Add explicit API route protection
  app.use('/api/*', (req, res, next) => {
    // Ensure API routes are not intercepted by frontend
    next();
  });
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', err);
    res.status(status).json({ message });
  });

  // Setup Vite in development, serve static in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // FIXED: Use port 5000 to match workflow expectations
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Increase max listeners to prevent warnings
  server.setMaxListeners(20);
  
  server.listen(port, '0.0.0.0', () => {
    log(`🚀 Server running on http://0.0.0.0:${port}`);
    log(`📱 App preview: https://${process.env.REPL_SLUG || 'your-repl'}.${process.env.REPL_OWNER || 'username'}.repl.co`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please stop other processes first.`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
})();
