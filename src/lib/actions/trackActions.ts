'use server';
import { DBTrack, Track } from "../models";
import  prisma  from "../../../prisma/client";
import { getDBGenres } from "./genreActions";
import { getDBTags } from "./tagActions";
import { revalidatePath } from 'next/cache';
import { formatDateTime, millisToMinutes, minutesToMillis } from '../scripts/data_utils';
import { Prisma, PrismaPromise } from "@prisma/client";

export async function createTrack(track:Track) {

  const dbGenres = await getDBGenres(track.genres);
  const connectGenresArray = dbGenres.map(genre => ({id: genre.id}));
  const dbTags = await getDBTags(track.tags);
  const connectTagsArray = dbTags.map(tag => ({id: tag.id }));
  const newTrack = prisma.track.create({data:{
    filename:   track.filename,
    folder:     track.folder,
    name:       track.name ?? undefined,
    artist:     track.artist ?? undefined,
    length:     track.length,
    bpm:        track.bpm ?? undefined,
    genres:     { 
                  connect: connectGenresArray,
                },
    tags:       { 
                  connect: connectTagsArray
                },
    album:      track.album ?? undefined,
    label:      track.label ?? undefined,
    key:        track.key ?? undefined,
    dateAdded:  new Date(track.dateAdded),
    rating:     track.rating ?? undefined,
    comment:    track.comment ?? undefined, 
    bitrate:    track.bitrate
  } ,
  include:{
    genres: true,
    tags: true
  }})
  return newTrack;
}

export async function createTracks(tracks: Track[]){
  let newTracks:PrismaPromise<Track>[]=[];
  for(const track of tracks){
    console.log("Uploading:",track.filename);
    const dbGenres = await getDBGenres(track.genres);
    const connectGenresArray = dbGenres.map(genre => ({id: genre.id}));
    const dbTags = await getDBTags(track.tags);
    const connectTagsArray = dbTags.map(tag => ({id: tag.id }));
    newTracks.push(prisma.track.create({data:{
      filename:   track.filename,
      folder:     track.folder,
      name:       track.name ?? undefined,
      artist:     track.artist ?? undefined,
      length:     track.length,
      bpm:        track.bpm ?? undefined,
      genres:     { 
                    connect: connectGenresArray,
                  },
      tags:       { 
                    connect: connectTagsArray
                  },
      album:      track.album ?? undefined,
      label:      track.label ?? undefined,
      key:        track.key ?? undefined,
      dateAdded:  new Date(track.dateAdded),
      rating:     track.rating ?? undefined,
      comment:    track.comment ?? undefined, 
      bitrate:    track.bitrate
    } ,
    include:{
      genres: true,
      tags: true
    }})
  )
  }
  await prisma.$transaction(newTracks)
}

export async function updateTrack(track:Track){
  const dbTrack: DBTrack = await getDBTracks([track])[0];

  const dbGenres = await getDBGenres(track.genres);
  const connectGenresArray = dbGenres.map(genre => ({id: genre.id}));
  const dbTags = await getDBTags(track.tags);
  const connectTagsArray = dbTags.map(tag => ({id: tag.id }));

  const updatedTrack = await prisma.track.update({
    where:{ id: dbTrack.id },
    data:{
      filename: track.filename,
      folder: track.folder,
      name: track.name ?? undefined,
      artist: track.artist ?? undefined,
      length: track.length,
      bpm: track.bpm ?? undefined,
      genres:{
        connect: connectGenresArray
      },
      tags:{
        connect: connectTagsArray
      },
      album: track.album ?? undefined,
      label: track.label ?? undefined,
      key:  track.key ?? undefined,
      dateAdded: new Date(track.dateAdded),
      rating: track.rating ?? undefined,
      comment: track.comment ?? undefined,
      bitrate: track.bitrate
    }
  })
}

export async function updateTrackFromDBTrack(dbTrack: DBTrack) {
  const connectGenresArray = dbTrack.genres.map(g => ({ id: g.id }));

  const connectTagsArray = dbTrack.tags.map(t => ({ id: t.id }));

  const updatedTrack = await prisma.track.update({
    where: { id: dbTrack.id },
    data: {
      filename: dbTrack.filename,
      folder: dbTrack.folder,
      name: dbTrack.name ?? undefined,
      artist: dbTrack.artist ?? undefined,
      length: dbTrack.length,
      bpm: dbTrack.bpm ?? undefined,
      genres: {
        set: [],           // Clear old connections
        connect: connectGenresArray,
      },
      tags: {
        set: [],           // Clear old connections
        connect: connectTagsArray,
      },
      album: dbTrack.album ?? undefined,
      label: dbTrack.label ?? undefined,
      key: dbTrack.key ?? undefined,
      dateAdded: new Date(dbTrack.dateAdded),
      rating: dbTrack.rating ?? undefined,
      comment: dbTrack.comment ?? undefined,
      bitrate: dbTrack.bitrate,
    },
  });

  return updatedTrack;
}

export async function getAllTracks(): Promise <Track[]>{
  const tracks = await prisma.track.findMany({
    include: {
      genres: true,
      tags: {
        include:{
          type:true
        }
      }      
    }
  });
  
  return tracks.map((track)=>({
    filename:   track.filename,
    folder:     track.folder,
    name:       track.name ?? undefined,
    artist:     track.artist ?? undefined,
    length:     track.length,
    bpm:        track.bpm ?? undefined,
    genres:     track.genres.map(g => ({
                  name: g.name
                })),
    tags:       track.tags.map(t => ({
                  name: t.name,
                  typeName: t.type.name
                })),
    album:      track.album ?? undefined,
    label:      track.label ?? undefined,
    key:        track.key ?? undefined,
    dateAdded:  track.dateAdded?.toISOString() ?? undefined,
    rating:     track.rating ?? undefined,
    comment:    track.comment ?? undefined, 
    bitrate:    track.bitrate
  }));
  
}

export async function getDBTracks(tracks: Track[]): Promise<DBTrack[]>{
  const dbTracks = await prisma.track.findMany({
    where:{
      AND:[
        {filename:{
          in: tracks.map(track => track.filename)
        }},
        {folder:{
          in: tracks.map(track => track.folder)
        }}
      ]
    }
  })

  return dbTracks.map(track =>({
    id: track.id,
    filename: track.filename,
    folder: track.folder,
    name: track.name ?? undefined,
    artist: track.artist ?? undefined,
    length: track.length,
    bpm: track.bpm ?? undefined,
    album: track.album ?? undefined,
    label: track.label ?? undefined,
    key:  track.key ?? undefined,
    dateAdded: track.dateAdded.toISOString(),
    rating: track.rating ?? undefined,
    comment: track.comment ?? undefined,
    bitrate: track.bitrate
  }))
}

export async function getFilteredTracks(query: Prisma.trackFindManyArgs): Promise<Track[]>{
  const tracks = await prisma.track.findMany(query);
  
  return tracks.map((track)=>({
    filename:   track.filename,
    folder:     track.folder,
    name:       track.name ?? undefined,
    artist:     track.artist ?? undefined,
    length:     track.length,
    bpm:        track.bpm ?? undefined,
    genres:     track.genres.map(g => ({
                  name: g.name
                })),
    tags:       track.tags.map(t => ({
                  name: t.name,
                  typeName: t.type.name
                })),
    album:      track.album ?? undefined,
    label:      track.label ?? undefined,
    key:        track.key ?? undefined,
    dateAdded:  track.dateAdded?.toISOString() ?? undefined,
    rating:     track.rating ?? undefined,
    comment:    track.comment ?? undefined, 
    bitrate:    track.bitrate
  }));
}

export async function getFilteredDBTracks(query: Prisma.trackFindManyArgs): Promise<DBTrack[]>{
  const tracks = await prisma.track.findMany(query);
  
  return tracks.map((track)=>({
    id:         track.id,
    filename:   track.filename,
    folder:     track.folder,
    name:       track.name ?? undefined,
    artist:     track.artist ?? undefined,
    length:     track.length,
    bpm:        track.bpm ?? undefined,
    genres:     track.genres.map(g => ({
                  id: g.id,
                  name: g.name,
                  color: g.color
                })),
    tags:       track.tags.map(t => ({
                  id: t.id,
                  name: t.name,
                  typeName: t.type.name,
                  color: t.type.color,
                  typeId: t.type.id
                })),
    album:      track.album ?? undefined,
    label:      track.label ?? undefined,
    key:        track.key ?? undefined,
    dateAdded:  track.dateAdded?.toISOString() ?? undefined,
    rating:     track.rating ?? undefined,
    comment:    track.comment ?? undefined, 
    bitrate:    track.bitrate
  }));
}

export async function deleteAllTracks(){
  const deletedTracks = await prisma.track.deleteMany({});
  return deletedTracks;
}
