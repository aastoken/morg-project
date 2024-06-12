import { DBTag } from "./Tag";


export type TagType = {
  name:   string;
  tags:   string[];
}

export type DBTagType = {
  id:     number;
  name:   string;
  tags:   DBTag[];
}