/**
 * VIRAAJDATA CONTROLLER - ULTIMATE users.txt Control System
 * This file ONLY controls users.txt and makes it work like CRAZY
 * Purpose: Insane level user tracking and management via users.txt file
 */

import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import { db, pool } from "./server/db";
import { users, type User, type InsertUser } from "./shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

interface ViraajUser {
  id: string;
  name: string;
  email: string;
  password: string;
  ipAddress: string;
  deviceId: string;
  userAgent: string;
  country: string;
  city: string;
  timezone: string;
  language: string;
  screenResolution: string;
  browserName: string;
  osName: string;
  createdAt: Date;
  lastLoginAt: Date;
  loginCount: number;
  totalSessions: number;
  projectsCreated: number;
  lastActivity: string;
  isOnline: boolean;
  deviceMemory: boolean;
}

export class ViraajDataController {
  private usersFile: string = path.join(process.cwd(), 'users.txt');
  private sessionsFile = 'sessions.txt';
  private deviceMemoryFile = 'device-memory.txt';
  private activityFile = 'user-activity.txt';
  private db: any;

  constructor() {
    this.initializeUsersFile();
  }

  // ===========================================
  // INSANE users.txt MANAGEMENT
  // ===========================================

  private async initializeUsersFile() {
    try {
      await fs.access(this.usersFile);
    } catch {
      const header = `# VIRAAJ ULTIMATE USERS DATABASE - users.txt
# This file tracks EVERYTHING about every user with INSANE detail
# Format: [TIMESTAMP] ACTION: UserID|Name|Email|IP|Device|Browser|OS|Country|City|LoginCount|Projects|Activity
# Every single user interaction is logged here with maximum detail
# Device memory, session tracking, location data, browser fingerprinting - ALL IN THIS FILE

[${new Date().toISOString()}] SYSTEM_INIT: VIRAAJDATA users.txt controller activated - MAXIMUM TRACKING ENABLED

`;
      await fs.writeFile(this.usersFile, header);
    }
    console.log('🔥 VIRAAJDATA: users.txt is LOADED and ready for INSANE tracking');
  }

  // ===========================================
  // CRAZY users.txt LOGGING SYSTEM
  // ===========================================

  private async logToUsersFile(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    await fs.appendFile(this.usersFile, logEntry).catch(console.error);
    console.log(`📝 USERS.TXT LOGGED: ${message.substring(0, 100)}...`);
  }

  private async logUserRegistration(user: ViraajUser, req: Request) {
    const deviceInfo = this.extractDeviceInfo(req);
    const locationInfo = await this.getLocationInfo(user.ipAddress);

    const detailedLog = `REGISTRATION: ${user.id}|${user.name}|${user.email}|${user.ipAddress}|${deviceInfo.deviceId}|${deviceInfo.browser}|${deviceInfo.os}|${locationInfo.country}|${locationInfo.city}|${deviceInfo.screen}|${deviceInfo.language}|${deviceInfo.timezone}|DEVICE_MEMORY_ENABLED`;

    await this.logToUsersFile(detailedLog);
  }

  private async logUserLogin(user: ViraajUser, req: Request, loginCount: number) {
    const deviceInfo = this.extractDeviceInfo(req);
    const activity = `LOGIN_${loginCount}: ${user.id}|${user.name}|${user.ipAddress}|${deviceInfo.deviceId}|${deviceInfo.browser}|SESSION_${Date.now()}|TOTAL_LOGINS_${loginCount}`;

    await this.logToUsersFile(activity);
  }

  private async logUserActivity(userId: string, action: string, details: string) {
    const activity = `ACTIVITY: ${userId}|${action}|${details}|${new Date().toISOString()}`;
    await this.logToUsersFile(activity);
  }

  private async logDeviceMemory(userId: string, deviceId: string, remembered: boolean) {
    const memory = `DEVICE_MEMORY: ${userId}|${deviceId}|REMEMBERED_${remembered}|AUTO_LOGIN_${remembered}|TIMESTAMP_${Date.now()}`;
    await this.logToUsersFile(memory);
  }

  // ===========================================
  // INSANE DATA EXTRACTION & TRACKING
  // ===========================================

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'VIRAAJ_ULTIMATE_SALT_2025').digest('hex');
  }

  private extractDeviceInfo(req: Request) {
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const ip = this.getClientIP(req);

    // Extract browser info
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Extract OS info
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Generate unique device fingerprint
    const deviceId = crypto.createHash('sha256')
      .update(`${userAgent}|${acceptLanguage}|${ip}|VIRAAJ_DEVICE_${Date.now()}`)
      .digest('hex')
      .slice(0, 16);

    return {
      deviceId,
      browser,
      os,
      language: acceptLanguage.split(',')[0] || 'en-US',
      screen: 'Unknown', // Would need client-side JS for this
      timezone: 'Unknown', // Would need client-side JS for this
      userAgent: userAgent.slice(0, 100) // Limit length
    };
  }

  private getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  }

  private async getLocationInfo(ip: string) {
    // In a real app, use a geolocation service
    // For now, return placeholder data
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown'
    };
  }

  private async getUserFromUsersFile(email: string): Promise<string | null> {
    try {
      const content = await fs.readFile(this.usersFile, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        if (line.includes('REGISTRATION:') && line.includes(email)) {
          const parts = line.split('|');
          if (parts.length > 0) {
            const userIdPart = parts[0];
            const userId = userIdPart.split('REGISTRATION: ')[1];
            return userId;
          }
        }
      }
    } catch (error) {
      console.error('Error reading users.txt:', error);
    }
    return null;
  }

  private async getLoginCountFromUsersFile(userId: string): Promise<number> {
    try {
      const content = await fs.readFile(this.usersFile, 'utf-8');
      const lines = content.split('\n');
      let count = 0;

      for (const line of lines) {
        if (line.includes(`LOGIN_`) && line.includes(userId)) {
          count++;
        }
      }

      return count;
    } catch (error) {
      console.error('Error counting logins:', error);
    }
    return 0;
  }

  // ===========================================
  // DATABASE OPERATIONS WITH users.txt INTEGRATION
  // ===========================================

  async createUser(userData: Partial<ViraajUser>): Promise<ViraajUser> {
    const userId = nanoid(16);
    const now = new Date();

    const newUser: ViraajUser = {
      id: userId,
      name: userData.name!,
      email: userData.email!,
      password: this.hashPassword(userData.password!),
      ipAddress: userData.ipAddress!,
      deviceId: userData.deviceId!,
      userAgent: userData.userAgent || '',
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown',
      language: 'en-US',
      screenResolution: 'Unknown',
      browserName: 'Unknown',
      osName: 'Unknown',
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1,
      totalSessions: 1,
      projectsCreated: 0,
      lastActivity: 'Registration',
      isOnline: true,
      deviceMemory: true
    };

    // Save user data to users.txt file (not database)
    const userDataLine = `USER_DATA: ${userId}|${newUser.name}|${newUser.email}|${newUser.password}|${newUser.ipAddress}|${newUser.deviceId}|${now.toISOString()}|${now.toISOString()}`;
    await this.logToUsersFile(userDataLine);

    return newUser;
  }

  async getUserByEmail(email: string): Promise<ViraajUser | null> {
    try {
      const content = await fs.readFile(this.usersFile, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        if (line.includes('USER_DATA:') && line.includes(email)) {
          const parts = line.split('|');
          if (parts.length >= 8) {
            const userIdPart = parts[0];
            const userId = userIdPart.split('USER_DATA: ')[1];
            const name = parts[1];
            const userEmail = parts[2];
            const password = parts[3];
            const ipAddress = parts[4];
            const deviceId = parts[5];
            const createdAt = new Date(parts[6]);
            const lastLoginAt = new Date(parts[7]);

            return {
              id: userId,
              name,
              email: userEmail,
              password,
              ipAddress,
              deviceId,
              userAgent: '',
              country: 'Unknown',
              city: 'Unknown',
              timezone: 'Unknown',
              language: 'en-US',
              screenResolution: 'Unknown',
              browserName: 'Unknown',
              osName: 'Unknown',
              createdAt,
              lastLoginAt,
              loginCount: 0,
              totalSessions: 0,
              projectsCreated: 0,
              lastActivity: 'File Load',
              isOnline: false,
              deviceMemory: false
            };
          }
        }
      }
    } catch (error) {
      console.error('Error reading user from users.txt:', error);
    }
    return null;
  }

  async getUserById(id: string): Promise<ViraajUser | null> {
    try {
      const content = await fs.readFile(this.usersFile, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        if (line.includes('USER_DATA:') && line.includes(id)) {
          const parts = line.split('|');
          if (parts.length >= 8) {
            const userIdPart = parts[0];
            const userId = userIdPart.split('USER_DATA: ')[1];
            
            if (userId === id) {
              const name = parts[1];
              const email = parts[2];
              const password = parts[3];
              const ipAddress = parts[4];
              const deviceId = parts[5];
              const createdAt = new Date(parts[6]);
              const lastLoginAt = new Date(parts[7]);

              return {
                id: userId,
                name,
                email,
                password,
                ipAddress,
                deviceId,
                userAgent: '',
                country: 'Unknown',
                city: 'Unknown',
                timezone: 'Unknown',
                language: 'en-US',
                screenResolution: 'Unknown',
                browserName: 'Unknown',
                osName: 'Unknown',
                createdAt,
                lastLoginAt,
                loginCount: 0,
                totalSessions: 0,
                projectsCreated: 0,
                lastActivity: 'File Load',
                isOnline: false,
                deviceMemory: false
              };
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading user by ID from users.txt:', error);
    }
    return null;
  }

  async updateUserLogin(userId: string, ipAddress: string, deviceId: string): Promise<void> {
    // Update login info in users.txt file
    const updateLog = `LOGIN_UPDATE: ${userId}|${ipAddress}|${deviceId}|${new Date().toISOString()}`;
    await this.logToUsersFile(updateLog);
  }

  // ===========================================
  // AUTHENTICATION ENDPOINTS
  // ===========================================

  setupAuthenticationSystem(app: Express) {
    // Session configuration
    this.setupSessionMiddleware(app);

    // Register endpoint
    app.post('/api/viraaj/register', async (req: Request, res: Response) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({
            success: false,
            error: 'All fields are required'
          });
        }

        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters'
          });
        }

        // Check if user exists
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: 'User already exists'
          });
        }

        // Create user with INSANE tracking
        const deviceInfo = this.extractDeviceInfo(req);
        const user = await this.createUser({
          name,
          email,
          password,
          ipAddress: this.getClientIP(req),
          deviceId: deviceInfo.deviceId,
          userAgent: deviceInfo.userAgent
        });

        // Log EVERYTHING to users.txt
        await this.logUserRegistration(user, req);
        await this.logDeviceMemory(user.id, deviceInfo.deviceId, true);
        await this.logUserActivity(user.id, 'ACCOUNT_CREATED', `name:${name}|email:${email}|ip:${user.ipAddress}`);

        // Create session
        (req.session as any).userId = user.id;
        (req.session as any).deviceId = deviceInfo.deviceId;

        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          message: 'Account created successfully'
        });

      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
          success: false,
          error: 'Registration failed'
        });
      }
    });

    // Login endpoint
    app.post('/api/viraaj/login', async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            error: 'Email and password are required'
          });
        }

        // Get user
        const user = await this.getUserByEmail(email);
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }

        // Verify password
        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }

        // Update login info
        const deviceInfo = this.extractDeviceInfo(req);
        await this.updateUserLogin(user.id, this.getClientIP(req), deviceInfo.deviceId);

        // Get login count and log
        const loginCount = await this.getLoginCountFromUsersFile(user.id) + 1;
        await this.logUserLogin(user, req, loginCount);
        await this.logDeviceMemory(user.id, deviceInfo.deviceId, true);
        await this.logUserActivity(user.id, 'LOGIN_SUCCESS', `ip:${this.getClientIP(req)}|device:${deviceInfo.deviceId}`);

        // Create session
        (req.session as any).userId = user.id;
        (req.session as any).deviceId = deviceInfo.deviceId;

        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          message: 'Login successful'
        });

      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
          success: false,
          error: 'Login failed'
        });
      }
    });

    // Device check endpoint
    app.get('/api/viraaj/check-device', async (req: Request, res: Response) => {
      try {
        const deviceInfo = this.extractDeviceInfo(req);
        const userId = (req.session as any)?.userId;

        if (userId) {
          await this.logDeviceMemory(userId, deviceInfo.deviceId, true);
        }

        res.json({
          success: true,
          deviceId: deviceInfo.deviceId,
          remembered: !!userId
        });
      } catch (error) {
        console.error('Device check error:', error);
        res.status(500).json({
          success: false,
          error: 'Device check failed'
        });
      }
    });

    // Logout endpoint
    app.post('/api/viraaj/logout', (req: Request, res: Response) => {
      const userId = (req.session as any)?.userId;
      
      if (userId) {
        this.logUserActivity(userId, 'LOGOUT', `timestamp:${Date.now()}`);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({
            success: false,
            error: 'Logout failed'
          });
        }

        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      });
    });

    // Me endpoint
    app.get('/api/auth/me', async (req: Request, res: Response) => {
      try {
        const userId = (req.session as any)?.userId;

        if (!userId) {
          return res.status(401).json({
            success: false,
            error: 'Not authenticated'
          });
        }

        const user = await this.getUserById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        await this.logUserActivity(userId, 'AUTH_CHECK', 'session_valid');

        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });

      } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({
          success: false,
          error: 'Auth check failed'
        });
      }
    });

    // User projects endpoint
    app.get('/api/viraaj/user-projects', async (req: Request, res: Response) => {
      try {
        const userId = req.query.userId as string;
        const sessionUserId = (req.session as any)?.userId;

        if (!sessionUserId) {
          return res.status(401).json({
            success: false,
            error: 'Not authenticated'
          });
        }

        if (userId !== sessionUserId) {
          return res.status(403).json({
            success: false,
            error: 'Access denied'
          });
        }

        const projects = await this.getUserProjects(userId, '');
        
        res.json({
          success: true,
          projects: projects || []
        });

      } catch (error) {
        console.error('User projects error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to load user projects'
        });
      }
    });

    // Admin endpoint to view users data
    app.get('/api/viraaj/admin/users-data', async (req: Request, res: Response) => {
      try {
        const content = await fs.readFile(this.usersFile, 'utf-8');
        res.json({
          success: true,
          data: content
        });
      } catch (error) {
        console.error('Admin data error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to load users data'
        });
      }
    });
  }

  private setupSessionMiddleware(app: Express) {
    // Use in-memory session store instead of PostgreSQL for simplicity
    app.use(session({
      secret: process.env.SESSION_SECRET || 'viraaj-ultimate-secret-2025',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    }));
  }

  requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session as any)?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    next();
  };

  // ===========================================
  // PROJECT MANAGEMENT WITH users.txt INTEGRATION
  // ===========================================

  async saveProject(userId: string, deviceId: string, projectData: any): Promise<string | null> {
    try {
      const projectId = nanoid(12);
      const projectInfo = {
        id: projectId,
        userId,
        deviceId,
        ...projectData,
        createdAt: new Date().toISOString(),
        savedAt: new Date().toISOString()
      };

      // Save project data to file
      const projectsDir = path.join(process.cwd(), 'user-projects');
      await fs.mkdir(projectsDir, { recursive: true });
      
      const projectFile = path.join(projectsDir, `${projectId}.json`);
      await fs.writeFile(projectFile, JSON.stringify(projectInfo, null, 2));

      // Log to users.txt
      await this.logUserActivity(userId, 'PROJECT_SAVED', `id:${projectId}|name:${projectData.name}|type:${projectData.type}`);

      return projectId;
    } catch (error) {
      console.error('Project save error:', error);
      return null;
    }
  }

  async getUserProjects(userId: string, deviceId: string): Promise<any[]> {
    try {
      const projectsDir = path.join(process.cwd(), 'user-projects');
      
      try {
        const files = await fs.readdir(projectsDir);
        const projects = [];

        for (const file of files) {
          if (file.endsWith('.json')) {
            try {
              const projectFile = path.join(projectsDir, file);
              const content = await fs.readFile(projectFile, 'utf-8');
              const project = JSON.parse(content);

              if (project.userId === userId) {
                projects.push(project);
              }
            } catch (fileError) {
              console.error(`Error reading project file ${file}:`, fileError);
            }
          }
        }

        // Log activity
        await this.logUserActivity(userId, 'PROJECTS_LOADED', `count:${projects.length}`);

        return projects.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      } catch (dirError) {
        // Directory doesn't exist, return empty array
        return [];
      }
    } catch (error) {
      console.error('Get user projects error:', error);
      return [];
    }
  }

  async updateProjectAccess(projectId: string, userId: string): Promise<void> {
    try {
      await this.logUserActivity(userId, 'PROJECT_ACCESSED', `id:${projectId}`);
    } catch (error) {
      console.error('Update project access error:', error);
    }
  }

  // ===========================================
  // INITIALIZATION
  // ===========================================

  async initialize(app: Express) {
    console.log('🚀 VIRAAJDATA CONTROLLER: Initializing INSANE users.txt system...');
    
    await this.logToUsersFile('SYSTEM_READY: VIRAAJDATA CONTROLLER FULLY OPERATIONAL - users.txt tracking ACTIVATED');
    
    this.setupAuthenticationSystem(app);
    
    console.log('✅ VIRAAJDATA CONTROLLER: users.txt system ready');
    console.log('📝 USERS.TXT: INSANE level tracking activated');
    console.log('🔐 AUTHENTICATION: Custom endpoints operational');
    console.log('💾 DEVICE MEMORY: Browser fingerprinting active');
    console.log('📊 ACTIVITY LOGS: Everything logged to users.txt');
    console.log('📁 PROJECT TRACKING: Real user projects system active');
  }
}

export const viraajData = new ViraajDataController();
export const requireViraajAuth = viraajData.requireAuth;