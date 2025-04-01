import { initializeDatabase } from './dbClient';
import { UserRepository } from './repositories/userRepository';
import { MessageRepository } from './repositories/messageRepository';
import { ProjectRepository } from './repositories/projectRepository';
import { SessionRepository } from './repositories/sessionRepository';
import { TelemetryRepository } from './repositories/telemetryRepository';

// Initialize database on first import
initializeDatabase();

// Export repositories for use throughout the app
export {
  UserRepository,
  MessageRepository,
  ProjectRepository,
  SessionRepository,
  TelemetryRepository
};

// For convenience, export types
export * from './models/types';
