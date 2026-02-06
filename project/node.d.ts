// Basic type definitions for Node.js
declare module 'node' {
  // Minimal Node.js types needed for the project
  
  // Process
  interface Process {
    env: Record<string, string | undefined>;
    cwd(): string;
    platform: string;
  }
  
  // Global declarations
  global {
    var process: Process;
    var require: (id: string) => any;
    var __dirname: string;
    var __filename: string;
    
    interface Console {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
      info(...args: any[]): void;
    }
    
    var console: Console;
  }
}