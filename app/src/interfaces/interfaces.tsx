// Hymns
export interface HymnInterface {
  id: string;
  name: string;
  altName: string;
  lyrics: string;
}

// Masses
export interface HymnDataInterface {
  id: string;
  name: string;
  hymnTypeId: number;
  fileIds: string[];
  files: FileInterface[];
}

export interface FileInterface {
  id: string;
  name: string;
  selected: boolean;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}
