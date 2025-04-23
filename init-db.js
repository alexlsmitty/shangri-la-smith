import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Ensure the data directory exists
  const dataDir = path.join(__dirname, '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Database file path
  const dbPath = path.join(dataDir, 'shangri-la.db');
  console.log(`Database will be created at: ${dbPath}`);

  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Execute main schema
  console.log('Initializing main database schema...');
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split the schema into statements
  const statements = schema.split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);
  
  // Execute each statement
  for (const statement of statements) {
    await db.exec(statement + ';');
  }
  
  console.log('Main database schema initialized successfully');

  // Execute auth schema
  console.log('Initializing authentication schema...');
  const authSchemaPath = path.join(__dirname, 'db', 'auth-schema.sql');
  
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
      } catch (_) {
      console.warn(`Warning executing auth schema statement`);
      console.log(`Statement: ${statement}`);
      }
    }
    
    console.log('Authentication schema initialized successfully');
  } else {
    console.warn('Authentication schema file not found, skipping...');
  }

  // Test a query to verify schema was loaded
  const rooms = await db.all('SELECT id, name, slug FROM room_types');
  console.log('Room types in database:');
  console.table(rooms);

  // Check if auth tables were created
  try {
    const users = await db.all('SELECT COUNT(*) as count FROM users');
    console.log(`Users table created successfully. Current count: ${users[0].count}`);
  } catch (error) {
    console.warn('Users table not found or error accessing it');
  }

  // Close the database connection
  await db.close();
  console.log('Database connection closed');
}

main().catch(err => {
  console.error('Error initializing database:', err);
});
