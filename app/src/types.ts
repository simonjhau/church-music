import { z } from "zod";

export const HymnSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    lyrics: z.string().nullable(),
  })
  .strict();
export type Hymn = z.infer<typeof HymnSchema>;

export interface File {
  id: string;
  name: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}
