import { Genre, Tag, TagType, Track } from "../models";

export function parseGenres(genresTag: string[]): Genre[]{
  const genres: Genre[] = [];
  if(genresTag.length <= 0 || genresTag == undefined)
    return genres;
  let genreNames = genresTag[0];
  let splitGenres = genreNames.split(/[,/;]/)
  
  splitGenres.map((genre)=>{
    const cleanGenre = genre.replace(/\0/g, '').trim();
    genres.push({name: cleanGenre, color: "#ffffff"});
  });
  

  return genres;
}

export function parseTags(tagString: string): Tag[]{
  const tags: Tag[] = [];
  const keyPattern = /\d{1,2}[a-zA-Z]/g;
  const energyPattern = /Energy (10|[1-9])/g;
  const spacesPattern = /^\s*$/;
  if(tagString==null || tagString== undefined)
    return tags;

  const keyMatch = tagString.match(keyPattern);
  const energyMatch = tagString.match(energyPattern); 
  if(keyMatch != null){
    tags.push({name: keyMatch[0].toString(),
              typeName: "Key",
              color: "#ffffff"});
  }

  if(energyMatch != null){
    tags.push({name: energyMatch[0].toString(),
              typeName: "Energy",
              color: "#ffffff"});
  }

  const cleanTagString = tagString.replaceAll(keyPattern,'').replaceAll(energyPattern,'').replaceAll('-','')
  const tagNames = cleanTagString.split(',');
  tagNames.map((name)=>{
    name = name.trim()
    if(!spacesPattern.test(name)){
      //TODO - Add a step to check if there are any existing tags with that name and assign them the first match's corresponding type.
      tags.push({name: name,
              typeName: "Imported",
              color: "#ffffff"})
    }
  });
  return tags;
}

export function checkNewGenres(track: Track, existingGenres: string[]): string[]{
  existingGenres = existingGenres.map(item => item.toLowerCase());//for exact string comparison

  let newGenres: string[] = []
  try{
    if(track.genres == null || track.genres.length <= 0 )
      return newGenres;

    newGenres = newGenres.concat(track.genres.filter((genre :Genre) => !existingGenres.includes(genre.name.toLowerCase())).map(genre => genre.name)); 

  } catch (error) {
    console.error("Error while checking for new genres:",error);
  }

  return newGenres;
}


export function checkNewTagTypeNames(track: Track, existingTagTypes: TagType[]|string[]): string[]{
  let existingTypeNames = [''];
  if (Array.isArray(existingTagTypes) && typeof existingTagTypes[0] === 'string') {
    existingTypeNames = existingTagTypes.map(name => (name as string).toLowerCase());
  } else if (Array.isArray(existingTagTypes) && typeof existingTagTypes[0] === 'object') {
    existingTypeNames = existingTagTypes.map(tagtype => (tagtype as TagType).name.toLowerCase());
  }

  let newTypeNames :string[]= [];
  try{
    if(track.tags == null || track.tags.length <= 0 )
      return [];
    
    
    //First we check if there are any new typeNames on the track
    for (const tag of track.tags){
      const newTypeNamesLowerCase = newTypeNames.map(name => name.toLowerCase());
      if(!existingTypeNames.includes(tag.typeName.toLowerCase()) && !newTypeNamesLowerCase.includes(tag.typeName.toLowerCase())){
        newTypeNames.push(tag.typeName);     
      }
    }
  } catch (error) {
    console.error("Error while checking for new tag type names:",error);
  }
    return newTypeNames;
}

export function checkNewTagTypes(track: Track, existingTagTypes: TagType[]): TagType[]{
  let newTagTypes: TagType[] = []


  try{
    if(track.tags == null || track.tags.length <= 0 )
      return existingTagTypes;
    
    //First we check if there are any new typeNames on the track
    let newTypeNames :string[]= checkNewTagTypeNames(track, existingTagTypes);
    newTagTypes = newTypeNames.map(typeName => ({name: typeName, tags: [], color: "#ffffff"}));

    const updatedTagTypes = existingTagTypes.concat(newTagTypes);

   
    newTagTypes = updatedTagTypes.map((tag_type) =>{
       //We access the tag[] of each tag_type to check if there are any new tag names on the track.
      const lowerCaseTags = tag_type.tags.map(tag => tag.name.toLowerCase());
      const newTags = track.tags
      .filter(tag => tag.typeName.toLowerCase() === tag_type.name.toLowerCase())
      .filter(tag => !lowerCaseTags.includes(tag.name.toLowerCase()))
      .map(tag => ({name: tag.name, color: tag.color, typeName: tag.typeName}))
      
      return {name: tag_type.name, tags: newTags, color: tag_type.color};
    });
  } catch (error) {
    console.error("Error while checking for new tags:",error);
  }

  return newTagTypes;
}

export function addNewTagtypesToExisting(existingTagTypes: TagType[], newTagTypes: TagType[]): TagType[]{
  const existingTypeNames = existingTagTypes.map(tagtype => tagtype.name.toLowerCase());
  let newTypeNames: string[] = []
  for (const tag of newTagTypes){
    if(!existingTypeNames.includes(tag.name.toLowerCase()) && !newTypeNames.includes(tag.name.toLowerCase())){
      newTypeNames.push(tag.name)
    }
  }
  

  let updatedTagTypes = existingTagTypes.concat(newTypeNames.map(typeName => ({name: typeName, tags: [], color: "#ffffff"})));//We add the new typenames with empty tag lists and white color
  //We populate the taglists of existing and new typenames with the new tags
  updatedTagTypes = updatedTagTypes.map((existingTagType) =>{
    //We access the tag[] of each tag_type to check if there are any new tag names on the track.
   const existingLowerCaseTags = existingTagType.tags.map(tag => tag.name.toLowerCase());
   for (const newTagType of newTagTypes){
    if(newTagType.name.toLowerCase() === existingTagType.name.toLowerCase()){
      const newTags = newTagType.tags.filter(newTag => !existingLowerCaseTags.includes(newTag.name.toLowerCase()));
      existingTagType.tags = existingTagType.tags.concat(newTags); 
    } 
   }
   return existingTagType;
 });


 return updatedTagTypes;
}

export function checkNewTags(track: Track, existingTags: Tag[]): Tag[]{
  let newTags: Tag[] = [];
  let trackTags: Tag[] = track.tags.map(tag => ({name: tag.name, typeName: tag.typeName, color: tag.color}));

  

  if(existingTags.length<=0){
    return trackTags;
  }
  trackTags.forEach(trackTag => {
    let isNew = true;
    
    for (let existingTag of existingTags) {
      let existingTagNameLC = existingTag.name.toLowerCase();
      let existingTagTypeLC = existingTag.typeName.toLowerCase();
      
      if (trackTag.name.toLowerCase() === existingTagNameLC && trackTag.typeName.toLowerCase() === existingTagTypeLC) {
        isNew = false;
        break;
      }
    }
    
    if (isNew) {
      newTags.push(trackTag);
    }
  });

  

  return newTags;
}

//Returns true if the track is new.
export function checkNewTracks(track: Track, existingTracks: Track[]): boolean{
  for (const existingTrack of existingTracks) {
    if (track.filename === existingTrack.filename && track.folder === existingTrack.folder) {
      console.log("Track:", track.filename, "Existing Track:", existingTrack.filename);
      return false;
    }
  }
  return true;
}


export function millisToMinutes(milliseconds : number){
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let result = `${minutes} min `;
  if(seconds !=0){
    result += `${seconds} s`
  }
  return result
}

export function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);

  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  
  // Format time
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Combine date and time
  const formattedDateTime = `${day}/${month}/${year} ${formattedTime}`;
  
  return formattedDateTime;
}