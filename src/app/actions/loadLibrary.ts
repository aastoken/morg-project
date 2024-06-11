'use server';
import path from 'path';
import config from '../../../morg_config/config.json';
import {walk} from "@root/walk";
import {File} from "node-taglib-sharp";
import { Track, Tag, Genre, TagType } from 'models';
import {prisma} from '../../../prisma/client'


type TrackDir = {
  filename: string,
  folder:   string
};

//Fetch the local filenames and paths
export default async function loadFilenames(): Promise<TrackDir[]> {
  const library_root: string = config.library_root;
  const filenames: TrackDir[] = [];
  console.log("Library root: " + library_root);
  await walk(library_root, async (err, filepath:string, dirent) => {
    if(err){
      throw err;
    }  
    console.log("Adding:", dirent.name,"in",path.dirname(filepath).replaceAll('\\','/')+"/");
    if (!dirent.isDirectory()) {
      filenames.push({filename: dirent.name, folder: path.dirname(filepath).replaceAll('\\','/')+"/"});
    }
    
  });
  return filenames;
}

export async function parseGenres(genresTag: string[]): Promise<Genre[]>{
  const genres: Genre[] = [];
  if(genresTag.length <= 0 || genresTag == undefined)
    return genres;
  let genreNames = genresTag[0];
  let splitGenres = genreNames.split(/[,/;]/)
  splitGenres.map((genre)=>{
    genres.push({name: genre.trim()});
  });
  

  return genres;
}

export async function parseTags(tagString: string): Promise<Tag[]>{
  const tags: Tag[] = [];
  const keyPattern = /\d{1,2}[a-zA-Z]/;
  const energyPattern = /Energy (10|[1-9])/;
  if(tagString==null || tagString== undefined)
    return tags;

  const keyMatch = tagString.match(keyPattern);
  const energyMatch = tagString.match(energyPattern); 
  if(keyMatch != null){
    tags.push({name: keyMatch[0].toString(),
            typeName: "Key"});
  }

  if(energyMatch != null){
    tags.push({name: energyMatch[0].toString(),
              typeName: "Energy"});
  }

  const cleanTagString = tagString.replace(keyPattern,'').replace(energyPattern,'').replaceAll('-','').replaceAll(' ','');
  const tagNames = cleanTagString.split(',');
  tagNames.map((name)=>{
    if(name!=''&& name!=' '){
      tags.push({name: name,
        typeName: "NONE"})
    }
  });
  return tags;
}

//Iterate through the local tracks and extract all their relevant metadata
export async function generateTracks(trackFiles: TrackDir[]): Promise<Track[]>{
  let tracks: Track[] = [];
  try{
    tracks = await Promise.all(trackFiles.map(async (trackDir)=>{
      const path = trackDir.folder+trackDir.filename;
      const file = File.createFromPath(path);
      
      const track: Track = {
        filename: trackDir.filename,
        folder:   trackDir.folder,
        name:     file.tag.title,
        artist:   file.tag.firstPerformer,
        length:   file.length,
        bpm:      file.tag.beatsPerMinute,
        genres:   await parseGenres(file.tag.genres),
        tags:     await parseTags(file.tag.comment),
        album:    file.tag.album,
        label:    file.tag.publisher,
        key:      file.tag.initialKey,
        dateAdded:new Date().toISOString(),
        rating:   0,
        comment:  file.tag.comment
      };

      return track;
    }));
  }catch(error){
    console.error("Error reading tags from track:",error);
  }
  
  return tracks;
}

//Upload the analysis results to the DB
export async function updateDB(tracks: Track[]){
  const existingGenres: string[] = await getAllGenreNames();
  const existingTags: string[] = await getAllTagNames();

  let newGenres: string[] = []
  let newTags:  string[] = []

  for (const track of tracks) {
    let checkedNewGenres = await checkNewGenres(track, existingGenres);
    existingGenres.push(...checkedNewGenres);
    newGenres.push(...checkedNewGenres);
    

    let checkedNewTags = await checkNewTags(track, existingTags);
    existingTags.push(...checkedNewTags);
    newGenres.push(...checkedNewTags);
  }

  console.log("Existing Genres:",existingGenres);
  console.log("New Genres:",newGenres);
  console.log("New Tags:", newTags);
}

export async function getAllGenres(): Promise <Genre[]>{
  return await prisma.genre.findMany();
}
export async function getAllGenreNames(): Promise<string[]>{
  const genres = await getAllGenres();
  const genreNames = genres.map(genre => genre.name);
  return genreNames;
}



export async function checkNewGenres(track: Track, existingGenres: string[]): Promise <string[]>{
  existingGenres = existingGenres.map(item => item.toLowerCase());//for exact string comparison

  let newGenres: string[] = []
  try{
    if(track.genres != null && track.genres.length > 0 ){
      newGenres = newGenres.concat(track.genres.filter((genre :Genre) => !existingGenres.includes(genre.name.toLowerCase())).map(genre => genre.name));
      
    }
  } catch (error) {
    console.error("Error while checking for new genres:",error);
  }

  return newGenres;
}

export async function updateGenres(genres: Genre[]){

}

export async function getAllTags(): Promise <Tag[]>{
  const tags = await prisma.tag.findMany({
    relationLoadStrategy: 'join',
    select:{
      name: true,
      type: {
        select:{
          name: true,
        }
      }
    }
  });
  const allTags: Tag[] = tags.map((tag)=>({
    name: tag.name,
    typeName: tag.type.name
  }));
  return allTags;
}
export async function getAllTagNames(): Promise <string[]>{
  const tags = await getAllTags();
  const tagNames = tags.map(tag => tag.name);
  return tagNames;
}


export async function checkNewTags(track: Track, existingTags: string[]): Promise<string[]>{
  const newTags: string[] = []
  try{
    if(track.tags != null && track.tags.length > 0 ){
      newTags.concat(track.tags.filter(tag => !existingTags.includes(tag.name)).map(tag => tag.name));
    }
  } catch (error) {
    console.error("Error while checking for new tags:",error);
  }

  return newTags;
}

export async function updateTags(tags: Tag[]){

}




// export async function getallTagTypes(): Promise <TagType[]>{
//   const tagTypes = prisma.tag_type.findMany();
//   return tagTypes;
// }