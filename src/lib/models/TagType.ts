import { DBTag, Tag } from "./Tag";


export type TagType = {
  name:   string;
  color:  string;
  tags:   Tag[];
}

export type DBTagType = {
  id:     number;
  color:  string;
  name:   string;
  tags:   DBTag[];
}

