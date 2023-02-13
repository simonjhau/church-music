import { readdir, unlink } from "fs/promises";
import path from "path";
import { type z } from "zod";
import { fromZodError } from "zod-validation-error";

export const parseData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errString: string
): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${errString}:\n${fromZodError(result.error).message}`);
  }
  return result.data;
};

export const deleteFilesInDirectory = async (
  directory: string
): Promise<void> => {
  const files = await readdir(directory);
  for (const file of files) {
    await unlink(path.join(directory, file));
  }
};
