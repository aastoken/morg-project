'use server';
import path from 'path';
import config from '../../../morg_config/config.json';
import {walk} from "@root/walk";
import {File} from "node-taglib-sharp";
import { Track, Tag, Genre, TagType, TrackDir, DBGenre, DBTag } from '../models';
import { addNewTagtypesToExisting, checkNewGenres, checkNewTagTypeNames, checkNewTagTypes, checkNewTags, checkNewTracks, parseGenres, parseTags } from '../scripts';
import { createGenres, getAllGenreNames } from './genreActions';
import { createTagTypes, getAllTagTypeNames, getallTagTypes } from './tagTypeActions';
import { createTags, getAllTags } from './tagActions';
import { createTrack, createTracks, getAllTracks } from './trackActions';



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
        name:     file.tag.title?.replace(/\0/g, '') ?? '',
        artist:   file.tag.firstPerformer?.replace(/\0/g, '') ?? '',
        length:   file.properties.durationMilliseconds,
        bpm:      file.tag.beatsPerMinute,
        genres:   parseGenres(file.tag.genres),
        tags:     parseTags(file.tag.comment),
        album:    file.tag.album?.replace(/\0/g, '') ?? '',
        label:    file.tag.publisher?.replace(/\0/g, '') ?? '',
        key:      file.tag.initialKey?.replace(/\0/g, '') ?? '',
        dateAdded:new Date().toISOString(),
        rating:   0,
        comment:  file.tag.comment?.replace(/\0/g, '') ?? '',
        bitrate:  file.properties.audioBitrate
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
  const existingTagTypeNames: string[] = await getAllTagTypeNames();
  const existingTags: Tag[] = await getAllTags();
  const existingTracks: Track[] = await getAllTracks();

  const newGenres: string[] = [];
  const newTagTypeNames: string[] = [];
  const newTags:  Tag[] = [];
  const newTracks: Track[] = [];

  for (const track of tracks) {
    let checkedNewGenres = checkNewGenres(track, existingGenres);
    existingGenres.push(...checkedNewGenres);
    newGenres.push(...checkedNewGenres);
    
    let checkedNewTagTypeNames = checkNewTagTypeNames(track, existingTagTypeNames);
    existingTagTypeNames.push(...checkedNewTagTypeNames);
    newTagTypeNames.push(...checkedNewTagTypeNames);
    
    let checkedNewTags = checkNewTags(track, existingTags)
    newTags.push(...checkedNewTags);
    existingTags.push(...checkedNewTags);

    if(checkNewTracks(track, existingTracks)){    
      newTracks.push(track);
      existingTracks.push(track);
    }
  }
  console.log("New genres: ",newGenres);
  if(newGenres.length > 0){
    const genres = newGenres.map(name =>({name: name})); 
    await createGenres(genres);
  }
  console.log("New TagTypes:",newTagTypeNames)
  if(newTagTypeNames.length > 0){
    await createTagTypes(newTagTypeNames);
  }
  console.log("New Tags:",newTags);
  if(newTags.length > 0){
    await createTags(newTags);
  }
  console.log("New Tracks:", newTracks);
  if(newTracks.length > 0){
    await createTracks(tracks);
  }
}










