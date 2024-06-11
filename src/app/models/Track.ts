import { Genre } from "./Genre";
import { Tag } from "./Tag";

export type Track = {
  filename:  string;
  folder:    string;
  name?:      string;
  artist?:    string;
  length:    number;
  bpm?:       number;
  genres?:    Genre[];  
  tags?:      Tag[];
  album?:     string;
  label?:     string;
  key?:       string;
  dateAdded?: string;
  rating?:    number;
  comment?:  string;
}

