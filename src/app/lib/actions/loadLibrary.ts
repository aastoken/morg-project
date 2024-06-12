'use server';
import path from 'path';
import config from '../../../../morg_config/config.json';
import {walk} from "@root/walk";
import {File} from "node-taglib-sharp";
import { Track, Tag, Genre, TagType, TrackDir, DBGenre, DBTag } from 'lib/models';
import {prisma} from '../../../../prisma/client'
import { addNewTagsToExisting, checkNewGenres, checkNewTags, parseGenres, parseTags } from 'lib/scripts';
import { getAllGenreNames } from './genreActions';
import { getAllTagTypeNames, getallTagTypes } from './tagTypeActions';



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



//Iterate through the local tracks and extract all their relevant metadata
export async function generateTracks(trackFiles: TrackDir[]): Promise<Track[]>{
  let tracks: Track[] = [];
  try{
    tracks = trackFiles.map((trackDir)=>{
      const path = trackDir.folder+trackDir.filename;
      const file = File.createFromPath(path);
      
      const track: Track = {
        filename: trackDir.filename,
        folder:   trackDir.folder,
        name:     file.tag.title,
        artist:   file.tag.firstPerformer,
        length:   file.properties.durationMilliseconds,
        bpm:      file.tag.beatsPerMinute,
        genres:   parseGenres(file.tag.genres),
        tags:     parseTags(file.tag.comment),
        album:    file.tag.album,
        label:    file.tag.publisher,
        key:      file.tag.initialKey,
        dateAdded:new Date().toISOString(),
        rating:   0,
        comment:  file.tag.comment,
        bitrate:  file.properties.audioBitrate.toString()+" kbps"
      };

      return track;
    });
  }catch(error){
    console.error("Error reading tags from track:",error);
  }
  
  return tracks;
}

//Upload the analysis results to the DB
export async function updateDB(tracks: Track[]){
  const existingGenres: string[] = await getAllGenreNames();
  let existingTags: TagType[] = await getallTagTypes();
  let newGenres: string[] = []
  let newTags:  TagType[] = await getAllTagTypeNames();

  for (const track of tracks) {
    let checkedNewGenres = checkNewGenres(track, existingGenres);
    existingGenres.push(...checkedNewGenres);
    newGenres.push(...checkedNewGenres);
    

    let checkedNewTags = checkNewTags(track, existingTags);
    newTags = addNewTagsToExisting(newTags,checkedNewTags);
    existingTags = addNewTagsToExisting(existingTags, checkedNewTags);
  
    

  }
  console.log("Only new Tags:",newTags);
}










