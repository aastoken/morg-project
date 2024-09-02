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
  bitrate:    number;
}

export const trackKeys = [
  'File Name',
  'Folder',
  'Name',
  'Artist',
  'Length',
  'BPM',
  'Genres',
  'Tags',
  'Album',
  'Label',
  'Key',
  'Date Added',
  'Rating',
  'Comment',
  'Bitrate'
];

export type DBTrack = {
  id:         number,
  filename:   string;
  folder:     string;
  name?:      string;
  artist?:    string;
  length:     number;
  bpm?:       number;
  genres:     DBGenre[];  
  tags:       DBTag[];
  album?:     string;
  label?:     string;
  key?:       string;
  dateAdded:  string;
  rating?:    number;
  comment?:   string;
  bitrate:    number;
}

export type PlaylistTrack = {
  id: number,
  trackId: number,
  playlistId: number,
  track: DBTrack,
  order: number 
}