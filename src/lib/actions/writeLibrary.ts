'use server';
import path from 'path';
import config from '../../../morg_config/config.json';
import {walk} from "@root/walk";
import {File} from "node-taglib-sharp";
import { DBTrack } from '../models';


export async function writeTrackToFile(track: DBTrack): Promise<void> {
  const filePath = track.folder + track.filename;
  try {
    const file = File.createFromPath(filePath);
    
    file.tag.title = track.name ?? "";
    file.tag.performers = [track.artist ?? ""];
    file.tag.beatsPerMinute = track.bpm ?? 0;
    file.tag.genres = track.genres.map(g => g.name);
    file.tag.comment = track.tags.map(tag => tag.name).join(", ");
    file.tag.album = track.album ?? "";
    file.tag.publisher = track.label ?? "";
    file.tag.initialKey = track.key ?? "";
    
    file.save();
    console.log(`Updated tags for ${track.folder}${track.filename}`);
  } catch (error) {
    console.error("Error updating tags for track:", error);
    throw error;
  }
}