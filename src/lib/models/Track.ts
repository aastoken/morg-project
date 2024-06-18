import { DBGenre, Genre } from "./Genre";
import { DBTag, Tag } from "./Tag";

export type Track = {
  filename:   string;
  folder:     string;
  name?:      string;
  artist?:    string;
  length:     number;
  bpm?:       number;
  genres:     Genre[];  
  tags:       Tag[];
  album?:     string;
  label?:     string;
  key?:       string;
  dateAdded:  string;
  rating?:    number;
  comment?:   string;
  bitrate:    string;
}

export type DBTrack = {
  id:         number,
  filename:   string;
  folder:     string;
  name?:      string;
  artist?:    string;
  length:     number;
  bpm?:       number;
  album?:     string;
  label?:     string;
  key?:       string;
  dateAdded:  string;
  rating?:    number;
  comment?:   string;
  bitrate:    string;
}

