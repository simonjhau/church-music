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

export const getErrorMessage = (
  e: unknown,
  defaultMessage = "Unknown error"
): string => {
  return e instanceof Error ? e.message : defaultMessage;
};
