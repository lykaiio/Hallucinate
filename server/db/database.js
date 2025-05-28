// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// IMPORTS - External libraries and Node.js utilities
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CONFIGURATION - SQLite database setup and path resolution
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// __dirname workaround for ESM modules since __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve absolute path to database file in the same directory as this script
const dbPath = path.resolve(__dirname, "database.sqlite");

// Database connection instance - will be initialized when init() is called
let db;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE INITIALIZATION - Setup database connection and create tables
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Initialize the SQLite database connection and create required tables
 * This function should be called once when the application starts
 */
export function init() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Failed to open database:", err.message);
    } else {
      console.log("Database initialized");

      // Create accounts table if it doesn't exist
      // Uses IF NOT EXISTS to prevent errors on subsequent runs
      db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          login TEXT NOT NULL,
          riotId TEXT NOT NULL,
          region TEXT NOT NULL,
          password TEXT NOT NULL,
          rank TEXT DEFAULT 'Unranked',
          lp TEXT DEFAULT '0 LP',
          winRate TEXT DEFAULT '0%',
          imageSrc TEXT DEFAULT 'Unranked.webp'
        );
      `);
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE ACCESS LAYER - Promise-based wrapper for SQLite operations
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Get database connection with Promise-based query methods
 * Provides a clean interface for database operations with proper error handling
 *
 * @returns {Object} Database connection object with all() and run() methods
 * @throws {Error} If database is not initialized
 */
export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call init() first.");
  }

  return {
    /**
     * Execute SELECT queries and return all matching rows
     *
     * @param {string} sql - SQL query string
     * @param {Array} params - Parameters for prepared statement (optional)
     * @returns {Promise<Array>} Promise resolving to array of result rows
     */
    all: (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),

    /**
     * Execute INSERT, UPDATE, DELETE queries
     *
     * @param {string} sql - SQL query string
     * @param {Array} params - Parameters for prepared statement (optional)
     * @returns {Promise<Object>} Promise resolving to object with lastID and changes
     */
    run: (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }),
  };
}
