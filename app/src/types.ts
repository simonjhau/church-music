import { z } from "zod";

export const BaseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Base = z.infer<typeof BaseSchema>;

export const HymnSchema = BaseSchema.extend({
  lyrics: z.string().nullable(),
}).strict();
export type Hymn = z.infer<typeof HymnSchema>;

export const MassSchema = BaseSchema.extend({
  dateTime: z.string().nullable(),
  fileId: z.string().nullable(),
}).strict();
export type Mass = z.infer<typeof MassSchema>;

export const FileSchema = z.object({
  id: z.string(),
  hymnName: z.string().optional(),
  fileTypeId: z.number(),
  bookId: z.number(),
  hymnNum: z.number().nullable(),
  comment: z.string(),
});
export type File = z.infer<typeof FileSchema>;

export interface MassHymn {
  id: string;
  name: string;
  hymnTypeId: number;
  fileIds: string[];
}

export const FileTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type FileType = z.infer<typeof FileTypeSchema>;

export const BookSchema = z.object({
  id: z.number(),
  name: z.string(),
  bookCode: z.string(),
});
export type Book = z.infer<typeof BookSchema>;

export interface HymnType {
  id: number;
  name: string;
}
