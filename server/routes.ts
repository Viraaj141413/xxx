import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { viraajData } from "../VIRAAJDATA.controller";

// Global project files storage
declare global {
  var projectFiles: Record<string, any> | undefined;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize VIRAAJDATA system
  await viraajData.initialize(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Advanced multi-file generation endpoint
  app.post('/api/generate/files', async (req, res) => {
    const { prompt, fileCount = 5, fileTypes = ['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json'], complexity = 'professional' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🚀 Generating ${fileCount} ${complexity} files for: ${prompt}`);

    try {
      // Use enhanced AI service for professional file generation
      const { EnhancedAI } = await import('./enhanced-ai-api');

      const generationRequest = {
        prompt: `Create ${fileCount} professional, production-ready files (${fileTypes.join(', ')}) for: ${prompt}. 

        Requirements:
        - Generate complete, functional code (no placeholders)
        - Use modern best practices and frameworks
        - Include proper error handling and validation
        - Make it visually stunning and responsive
        - Add interactive features and animations
        - Include comprehensive documentation
        - Optimize for performance and accessibility`,
        projectType: 'advanced-web-application',
        conversationHistory: [],
        userId: req.user?.id || 'anonymous'
      };

      const result = await EnhancedAI.generateProject(generationRequest);

      if (result.success) {
        // Save all generated files to ai-generated directory
        const fs = require('fs');
        const path = require('path');
        const aiGenDir = path.join(process.cwd(), 'ai-generated');

        if (!fs.existsSync(aiGenDir)) {
          fs.mkdirSync(aiGenDir, { recursive: true });
        }

        const savedFiles = {};
        Object.entries(result.files || {}).forEach(([filename, file]) => {
          const filePath = path.join(aiGenDir, filename);
          const dir = path.dirname(filePath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(filePath, file.content, 'utf8');
          savedFiles[filename] = {
            content: file.content,
            language: file.language,
            path: filePath,
            size: Buffer.byteLength(file.content, 'utf8')
          };
          console.log(`📄 Generated professional file: ${filename} (${Buffer.byteLength(file.content, 'utf8')} bytes)`);
        });

        global.projectFiles = result.files;

        res.json({
          success: true,
          message: `✅ Generated ${Object.keys(savedFiles).length} professional files!`,
          files: savedFiles,
          preview: '/preview/index.html',
          stats: {
            totalFiles: Object.keys(savedFiles).length,
            totalSize: Object.values(savedFiles).reduce((sum, file) => sum + file.size, 0),
            fileTypes: [...new Set(Object.values(savedFiles).map(f => f.language))]
          }
        });
      } else {
        throw new Error(result.error || 'Generation failed');
      }
    } catch (error) {
      console.error('❌ File generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate files',
        details: error.message 
      });
    }
  });

  // Main chat/AI endpoint - Always use GitHub API
  app.post('/api/chat', async (req, res) => {
    const { message, prompt } = req.body;
    const userInput = message || prompt;

    if (!userInput) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('💬 Chat request:', userInput);

    // ALWAYS call GitHub Models API - no fallbacks
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({ 
      baseURL: "https://models.github.ai/inference", 
      apiKey: "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" 
    });

    const completion = await client.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful AI assistant. Have normal conversations with users. Answer questions, provide information, help with coding problems, explain concepts, or just chat. Be friendly and helpful. Give varied, natural responses."
        },
        { role: "user", content: userInput }
      ],
      temperature: 0.9,
      top_p: 0.95,
      model: "openai/gpt-4.1"
    });

    const response = completion.choices[0].message.content || "I'm here to help! What would you like to talk about?";
    
    console.log('✅ GitHub API responded:', response.substring(0, 100) + '...');
    
    res.json({ 
      response: response, 
      success: true
    });
  });

  // Streaming multi-file generation endpoint
  app.post('/api/generate/stream', async (req, res) => {
    const { prompt, fileCount = 10, fileTypes = ['html', 'css', 'js', 'ts', 'jsx', 'tsx'] } = req.body;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    try {
      res.write(`data: ${JSON.stringify({
        stage: 'initializing',
        message: `🚀 Starting generation of ${fileCount} professional files...`,
        progress: 10
      })}\n\n`);

      // Enhanced AI generation
      const { EnhancedAI } = await import('./enhanced-ai-api');

      res.write(`data: ${JSON.stringify({
        stage: 'analyzing',
        message: '🧠 AI analyzing your requirements...',
        progress: 20
      })}\n\n`);

      const generationRequest = {
        prompt: `Create ${fileCount} cutting-edge, production-ready files for: ${prompt}

        File types to include: ${fileTypes.join(', ')}

        Requirements:
        - Write complete, functional, professional-grade code
        - Use latest frameworks and best practices
        - Include comprehensive error handling
        - Add beautiful, responsive UI/UX
        - Implement interactive features and animations
        - Include proper documentation and comments
        - Optimize for performance and accessibility
        - Make it enterprise-level quality`,
        projectType: 'enterprise-application',
        conversationHistory: []
      };

      res.write(`data: ${JSON.stringify({
        stage: 'generating',
        message: '⚡ Generating high-quality code files...',
        progress: 50
      })}\n\n`);

      const result = await EnhancedAI.generateProject(generationRequest);

      res.write(`data: ${JSON.stringify({
        stage: 'saving',
        message: '💾 Saving generated files...',
        progress: 80
      })}\n\n`);

      if (result.success) {
        // Save all files
        const fs = require('fs');
        const path = require('path');
        const aiGenDir = path.join(process.cwd(), 'ai-generated');

        if (!fs.existsSync(aiGenDir)) {
          fs.mkdirSync(aiGenDir, { recursive: true });
        }

        const savedFiles = {};
        Object.entries(result.files || {}).forEach(([filename, file]) => {
          const filePath = path.join(aiGenDir, filename);
          const dir = path.dirname(filePath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(filePath, file.content, 'utf8');
          savedFiles[filename] = {
            content: file.content,
            language: file.language,
            lines: file.content.split('\n').length,
            size: Buffer.byteLength(file.content, 'utf8')
          };
        });

        global.projectFiles = result.files;

        res.write(`data: ${JSON.stringify({
          stage: 'complete',
          message: `✅ Successfully generated ${Object.keys(savedFiles).length} professional files!`,
          progress: 100,
          result: {
            files: savedFiles,
            stats: {
              totalFiles: Object.keys(savedFiles).length,
              totalLines: Object.values(savedFiles).reduce((sum, file) => sum + file.lines, 0),
              totalSize: Object.values(savedFiles).reduce((sum, file) => sum + file.size, 0),
              fileTypes: [...new Set(Object.values(savedFiles).map(f => f.language))]
            },
            preview: '/preview/index.html'
          }
        })}\n\n`);
      } else {
        throw new Error(result.error || 'Generation failed');
      }

      res.end();
    } catch (error) {
      console.error('❌ Streaming generation error:', error);
      res.write(`data: ${JSON.stringify({
        stage: 'error',
        message: `❌ Generation failed: ${error.message}`,
        progress: 0
      })}\n\n`);
      res.end();
    }
  });

  // Replit Agent compatible endpoints
  app.post('/api/agent/generate', async (req: any, res) => {
    try {
      const { prompt, sessionId } = req.body;

       // Mock the generateReplitResponse function
      const generateReplitResponse = (prompt: string) => {
          const response = "I am an AI and I have generated a response for you based on the prompt:" + prompt;
          const files = {
              'index.html': {
                  content: '<h1>Hello World</h1>',
                  language: 'html'
              }
          };
          return { response: response, files: files };
      }

      const response = generateReplitResponse(prompt);

      res.json({
        success: true,
        checkpoint: Date.now(),
        sessionId: sessionId || `session_${Date.now()}`,
        response: response.response,
        files: response.files,
        agentMode: true
      });
    } catch (error) {
      console.error("Error in agent generation:", error);
      res.status(500).json({ message: "Agent generation failed" });
    }
  });

  // Project routes (Agent enhanced)
  app.post('/api/projects', async (req: any, res) => {
    try {
      const userId = req.user?.id || 'dev-user-123'; // Support both auth modes
      const { name, description, prompt, language, framework, files, agentSession } = req.body;

      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const project = await storage.createProject({
        id: projectId,
        userId,
        name,
        description,
        prompt,
        language,
        framework,
        files,
        agentSession,
        replitAgent: true
      });

      // Log checkpoint for Replit Agent billing
      console.log(`🎯 CHECKPOINT: Project ${projectId} created via Replit Agent`);

      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  const server = createServer(app);
  console.log('Advanced project auto-save system active');
  return server;
}