import { FilterRow } from "../models";

export const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const comparators = {
  // Existing comparators
  equals: (key, value) => ({ [key]: value }),
  notEquals: (key, value) => ({ [key]: { not: value } }),
  lessThan: (key, value) => ({ [key]: { lt: value } }),
  greaterThan: (key, value) => ({ [key]: { gt: value } }),
  lessOrEquals: (key, value) => ({ [key]: { lte: value } }),
  greaterOrEquals: (key, value) => ({ [key]: { gte: value } }),
  inRange: (key, min, max) => ({ [key]: { gte: min, lte: max } }),
  contains: (key, value) => ({ [key]: { contains: value } }),
  notContains: (key, value) => ({ [key]: { not: { contains: value } } }),

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

function buildRowQuery(existingQuery,
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
  selectedKey = dBLabels[selectedKey] //We translate the Label string to the db attribute name
  console.log("Key:",selectedKey,"Comparator:",selectedComparator)
  console.log("InputValue",inputValue,inputValueMin,inputValueMax,"Genres",selectedGenres,"Tags",selectedTags)
  // Handle the basic key-comparator-value conditions
  if (selectedComparator && comparators[selectedComparator]) {
    if (selectedComparator === 'inRange' || selectedComparator === 'dateInRange') {
      existingQuery = {
        ...existingQuery,
        ...comparators[selectedComparator](selectedKey, inputValueMin, inputValueMax)
      };
    } else {
      existingQuery = {
        ...existingQuery,
        ...comparators[selectedComparator](selectedKey, inputValue)
      };
    }
  }

  // Handle tag-based filtering
  if (selectedTags && selectedTags.length > 0) {
    if (selectedComparator === 'contains all') {
      existingQuery = {
        ...existingQuery,
        ...comparators.containsAll('tags', selectedTags)
      };
    } else if (selectedComparator === 'contains some') {
      existingQuery = {
        ...existingQuery,
        ...comparators.containsSome('tags', selectedTags)
      };
    } else if (selectedComparator === 'not contains') {
      existingQuery = {
        ...existingQuery,
        ...comparators.notContainsArray('tags', selectedTags)
      };
    }
  }

  // Handle genre-based filtering
  if (selectedGenres && selectedGenres.length > 0) {
    if (selectedComparator === 'contains all') {
      existingQuery = {
        ...existingQuery,
        ...comparators.containsAll('genres', selectedGenres)
      };
    } else if (selectedComparator === 'contains some') {
      existingQuery = {
        ...existingQuery,
        ...comparators.containsSome('genres', selectedGenres)
      };
    } else if (selectedComparator === 'not contains') {
      existingQuery = {
        ...existingQuery,
        ...comparators.notContainsArray('genres', selectedGenres)
      };
    }
  }
  console.log("Returning row query:",existingQuery)
  return existingQuery;
}

export function buildAdvancedQuery(filterRowsData : FilterRow[], allConditions: boolean){
  let explorerQuery = {}
  let conditionsQuery = {}
  for(const row of filterRowsData){
    conditionsQuery=  {
      
      ...buildRowQuery(conditionsQuery, row)
    }
  }
  if(allConditions){
    explorerQuery = {
      where:{
        AND:[
          conditionsQuery
        ]
      }
    }
  }
  else{
    explorerQuery = {
      where:{
        OR:[
          conditionsQuery
        ]
      }
    }
  }
  
  console.log("Returning Advanced Query:",explorerQuery)
  return explorerQuery
}