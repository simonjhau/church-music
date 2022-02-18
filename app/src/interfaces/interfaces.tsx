// Hymns
export interface HymnInterface {
  id: string;
  name: string;
  lyrics: string;
}

// Masses
export interface MassInterface {
  id: string;
  name: string;
  dateTime: string;
  fileId: string;
}
export interface HymnDataInterface {
  [key: string]: any;
  id: string;
  name: string;
  hymnTypeId: number;
  fileIds: string[];
}

export interface FileInterface {
  id: string;
  name: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}
