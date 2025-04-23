import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Helper for ES modules to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine database path based on environment
export const getDbPath = () => {
  // Check if running in Vercel production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // In Vercel, use the /tmp directory which is writable
  const baseDir = isProduction ? '/tmp' : path.join(__dirname, '..', '.data');
  
  // Ensure the directory exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  return path.join(baseDir, 'shangri-la.db');
};

// Initialize database if it doesn't exist
export const initializeDb = async () => {
  const dbPath = getDbPath();
  
  // Check if DB already exists
  const dbExists = fs.existsSync(dbPath);
  
  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');
  
  // If DB doesn't exist, initialize it
  if (!dbExists) {
    console.log(`Creating new database at: ${dbPath}`);
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the schema into statements
      const statements = schema.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      // Execute each statement
      for (const statement of statements) {
        await db.exec(statement + ';');
      }
      
      console.log('Database schema initialized successfully');
      
      // Also initialize auth schema if available
      const authSchemaPath = path.join(__dirname, '..', 'db', 'auth-schema.sql');
      if (fs.existsSync(authSchemaPath)) {
        const authSchema = fs.readFileSync(authSchemaPath, 'utf8');
        
        // Split the schema into statements
        const authStatements = authSchema.split(';')
          .map(statement => statement.trim())
          .filter(statement => statement.length > 0);
        
        // Execute each statement
        for (const statement of authStatements) {
          try {
            await db.exec(statement + ';');
          } catch (error) {
            console.warn(`Warning executing auth schema statement: ${error.message}`);
          }
        }
        
        console.log('Authentication schema initialized successfully');
      }
    }
  }
  
  return db;
};

// Get a database connection, initializing if needed
export const getDb = async () => {
  const dbPath = getDbPath();
  
  // Initialize DB if needed
  if (!fs.existsSync(dbPath)) {
    return initializeDb();
  }
  
  // Open existing database
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
};
