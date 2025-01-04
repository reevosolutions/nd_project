import { glob } from 'glob';
import path from 'node:path';

export async function listHtmlFiles(directory: string): Promise<string[]> {
  const files = await glob(path.join(directory, '**/*.html'));
  return files.map(file => path.basename(file));
}