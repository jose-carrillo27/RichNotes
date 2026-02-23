export type NoteWithRelations = {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  checkItems: CheckItem[];
  tags: NoteTagWithTag[];
  images: NoteImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type CheckItem = {
  id: string;
  text: string;
  isDone: boolean;
  order: number;
  noteId: string;
};

export type NoteTagWithTag = {
  noteId: string;
  tagId: string;
  tag: {
    id: string;
    name: string;
    color: string;
  };
};

export type NoteImage = {
  id: string;
  url: string;
  alt: string;
  noteId: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type NoteFormData = {
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  checkItems: Omit<CheckItem, "id" | "noteId">[];
  tagIds: string[];
};
