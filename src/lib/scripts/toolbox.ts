import { Prisma } from "@prisma/client";
import { DBTag, DBTagType, FilterRow } from "../models";

export const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const comparators = {
  // Existing comparators
  equals: (key, value) => ({ [key]: Number(value) }),
  notEquals: (key, value) => ({ [key]: { not: Number(value) } }),
  lessThan: (key, value) => ({ [key]: { lt: Number(value) } }),
  greaterThan: (key, value) => ({ [key]: { gt: Number(value) } }),
  lessOrEquals: (key, value) => ({ [key]: { lte: Number(value) } }),
  greaterOrEquals: (key, value) => ({ [key]: { gte: Number(value) } }),
  inRange: (key, min, max) => ({ [key]: { gte: Number(min), lte: (max) } }),

  contains: (key, value) => ({ [key]: { contains: value } }),
  notContains: (key, value) => ({ [key]: { not: { contains: value } } }),
  equalsString: (key, value) => ({ [key]: value }),
  notEqualsString: (key, value) => ({ [key]: { not: value } }),

  // Array comparators for tags and genres
  containsAll: (key, values) => {
    const filters = values.map(v => ({
      [key]: {
        some: {
          id: v.id
        }
      }
    }));
  
  return {
    AND: filters
    }
  },
  
  containsSome: (key, values) => ({
    [key]: {
      some: {
        id: { in: values.map(v => v.id) }
      }
    }
  }),
  notContainsArray: (key, values) => ({
    NOT: {
      [key]: {
        some: {
          id: { in: values.map(v => v.id) }
        }
      }
    }
  }),

  //Date Comparators
  dateEquals: (key, value) => ({ [key]: new Date(value) }),
  dateNotEquals: (key, value) => ({ [key]: { not: new Date(value) } }),
  dateBefore: (key, value) => ({ [key]: { lt: new Date(value) } }),
  dateAfter: (key, value) => ({ [key]: { gt: new Date(value) } }),
  dateBeforeOrEquals: (key, value) => ({ [key]: { lte: new Date(value) } }),
  dateAfterOrEquals: (key, value) => ({ [key]: { gte: new Date(value) } }),
  dateInRange: (key, min, max) => ({ [key]: { gte: new Date(min), lte: new Date(max) } }),
};

const dBLabels = {
  'File Name':"filename",
  'Folder':"folder",
  'Name':"name",
  'Artist':"artist",
  'Length':"length",
  'BPM':"bpm",
  'Genres':"genres",
  'Tags':"tags",
  'Album':"album",
  'Label':"label",
  'Key':"key",
  'Date Added':"dateAdded",
  'Rating':"rating",
  'Comment':"comment",
  'Bitrate':"bitrate"
  };

const comparatorTranslation = {
  '=':'equals',
  '<':'lessThan',
  '>':'greaterThan',
  '<=':'lessOrEquals',
  '>=':'greaterOrEquals',
  'range':'inRange',
  'equals':'equals',
  'not equals':'notEquals',
  'contains':'contains',
  'not contains':'notContains',
  'contains some':'containsSome',
  'contains all': 'containsAll'
};
const dateComparatorTranslation = {
  'equals':'dateEquals',
  'notEquals':'dateNotEquals',
  'lessThan':'dateBefore',
  'greaterThan':'dateAfter',
  'lessOrEquals':'dateBeforeOrEquals',
  'greaterOrEquals':'dateAfterOrEquals',
  'inRange':'dateInRange'
};

const stringFields = ['filename','folder','name','artist','album','label','key','rating','comment']

function buildRowQuery(
  {
  selectedKey,
  selectedComparator,
  selectedTags,
  selectedGenres,
  inputValue,
  inputValueMin,
  inputValueMax
  }:FilterRow
) {
  let conditionQuery = {}
  selectedKey = dBLabels[selectedKey] //We translate the Label string to the db attribute name
  selectedComparator = comparatorTranslation[selectedComparator]
  console.log("Key:",selectedKey,"Comparator:",selectedComparator)
  console.log("Input Values",inputValue,inputValueMin,inputValueMax,"Genres",selectedGenres,"Tags",selectedTags)
  // Handle the basic key-comparator-value conditions
  if (selectedComparator && comparators[selectedComparator]) {
    if(selectedKey === 'dateAdded'){

      selectedComparator = dateComparatorTranslation[selectedComparator]
      if(selectedComparator === 'dateInRange'){
        conditionQuery = {
          ...comparators[selectedComparator](selectedKey, inputValueMin, inputValueMax)
        };
      }
      else{
        conditionQuery = {
        ...comparators[selectedComparator](selectedKey, inputValue)
        };
      } 
    }
    else if (stringFields.includes(selectedKey)){

      if(selectedComparator === 'equals'){
        conditionQuery = {
        ...comparators.equalsString(selectedKey,inputValue)
        }
      }
      else if(selectedComparator === 'notEquals'){
        conditionQuery = {
        ...comparators.notEqualsString(selectedKey,inputValue)
        }
      }
      else{
        conditionQuery = {
          ...comparators[selectedComparator](selectedKey, inputValue)
        };
      }
    }
    else if(selectedKey === 'genres'){
          // Handle genre-based filtering
      if (selectedGenres && selectedGenres.length > 0) {
        if (selectedComparator === 'containsAll') {
          conditionQuery = {
            ...comparators.containsAll('genres', selectedGenres)
          };
        } else if (selectedComparator === 'containsSome') {
          conditionQuery = {
            ...comparators.containsSome('genres', selectedGenres)
          };
        } else if (selectedComparator === 'notContains') {
          conditionQuery = {
            ...comparators.notContainsArray('genres', selectedGenres)
          };
        }
      }
    }
    else if(selectedKey === 'tags'){
          // Handle tag-based filtering
      if (selectedTags && selectedTags.length > 0) {
        if (selectedComparator === 'containsAll') {
          conditionQuery = {
            ...comparators.containsAll('tags', selectedTags)
          };
        } else if (selectedComparator === 'containSome') {
          conditionQuery = {
            ...comparators.containsSome('tags', selectedTags)
          };
        } else if (selectedComparator === 'notContains') {
          conditionQuery = {
            ...comparators.notContainsArray('tags', selectedTags)
          };
        }
      }
    }
    else{

      if (selectedComparator === 'inRange') {
        conditionQuery = {
          ...comparators[selectedComparator](selectedKey, inputValueMin, inputValueMax)
        };
      } else {
        conditionQuery = {
          ...comparators[selectedComparator](selectedKey, inputValue)
        };
      }
    }
    
  }

  

  
  console.log("Returning row query:",conditionQuery)
  return conditionQuery;
}

export function buildTrackFilterQuery(filterRowsData : FilterRow[], allConditions: boolean): Prisma.trackFindManyArgs{
  let explorerQuery = {}
  let conditionsQuery: object[] = []

  for(const row of filterRowsData){
    conditionsQuery.push(buildRowQuery(row))    
  }
  console.log("ConditionsQuery", conditionsQuery)
  
  if(allConditions){
    explorerQuery = {
      where:{
        AND: conditionsQuery
        
      }
    }
  }
  else{
    explorerQuery = {
      where:{
        OR: conditionsQuery
        
      }
    }
  }
  
  console.log("Returning Advanced Query:",explorerQuery)
  return explorerQuery
}

export function getTagTypesFromTagArray(tags: DBTag[]): DBTagType[]{
  const tagTypeMap: Map<string, DBTagType> = new Map();

  tags.forEach(tag => {
    if (!tagTypeMap.has(tag.typeName)) {
      tagTypeMap.set(tag.typeName, {id:tag.typeId, name: tag.typeName, color: tag.color, tags: [] });
    }

    tagTypeMap.get(tag.typeName)!.tags.push(tag);
  });

  return Array.from(tagTypeMap.values());
}
