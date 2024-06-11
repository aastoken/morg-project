'use server';
import path from 'path';
import config from '../../../morg_config/config.json';
import {walk} from "@root/walk";
import {File} from "node-taglib-sharp";
import { Track, Tag, Genre } from 'models';
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
  
  genresTag.map((genre)=>{
    genres.push({name: genre});
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
  const existingGenres: Genre[] = await prisma.genre.findMany();
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
  const existingTags: Tag[] = tags.map((tag)=>({
    name: tag.name,
    typeName: tag.type.name
  }));
  
  tracks.map((track)=>{

  });
}