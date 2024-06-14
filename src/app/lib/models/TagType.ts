import { DBTag } from "./Tag";


export type TagType = {
  name:   string;
  tags:   string[];
}

export type DBTagType = {
  id:     number;
  name:   string;
}

export function isTagTypeArray(value: any): value is TagType[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(item => {
    return (
      typeof item.name === 'string' &&
      Array.isArray(item.tags) &&
      item.tags.every(tag => typeof tag === 'string')
    );
  });
}

export function isTagType(value: any): value is TagType {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string' &&
    Array.isArray(value.tags) &&
    value.tags.every(tag => typeof tag === 'string')
  );
}