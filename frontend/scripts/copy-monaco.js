import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source directory (node_modules)
const source = join(dirname(__dirname), 'node_modules', 'monaco-editor', 'min', 'vs');

// Destination directory (public)
const destination = join(dirname(__dirname), 'public', 'monaco-editor', 'min', 'vs');

// Copy files
fs.copy(source, destination)
  .then(() => console.log('Monaco editor files copied successfully!'))
  .catch(err => console.error('Error copying Monaco editor files:', err));
