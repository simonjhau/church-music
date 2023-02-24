import { z } from "zod";

export const HymnSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    lyrics: z.string().nullable(),
  })
  .strict();
export type Hymn = z.infer<typeof HymnSchema>;

export const BookSchema = z.object({
  id: z.number(),
  name: z.string(),
  bookCode: z.string(),
});
export type Book = z.infer<typeof BookSchema>;

export const FileTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type FileType = z.infer<typeof FileTypeSchema>;

export interface File {
  id: string;
  name: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}
