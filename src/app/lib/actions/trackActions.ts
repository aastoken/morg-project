import { Track } from "lib/models";
import { prisma } from "../../../../prisma/client";


export async function getAllTracks(): Promise <Track[]>{
  const tracks = await prisma.track.findMany({
    include: {
      genres: {
        include: {
          genre: true
        }
      },
      tags: {
        include: {
          tag: {
            include: {
              type: true
            }
          }
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
                  name: g.genre.name
                })),
    tags:       track.tags.map(t => ({
                  name: t.tag.name,
                  typeName: t.tag.type.name
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