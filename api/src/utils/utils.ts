import { readdir, unlink } from 'fs/promises';
import path from 'path';

export const deleteFilesInDirectory = async (directory: string) => {
  const files = await readdir(directory);
  for (const file of files) {
    unlink(path.join(directory, file));
  }
};
