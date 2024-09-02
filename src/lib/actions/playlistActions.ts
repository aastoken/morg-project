'use server';
import prisma  from "../../../prisma/client";
import { Playlist } from "../models";
import { mapPlaylist } from "../scripts";

export async function createPlaylist(
  name: string,
  description: string,
  filterDataId: number,
  tracks: {
    trackId: number,
    order: number
  }[]
): Promise<Playlist> {
  const newPlaylist = await prisma.playlist.create({
    data: {
      name,
      description,
      filterDataId,
      tracks: {
        create: tracks.map(track => ({
          trackId: track.trackId,
          order: track.order
        }))
      }
    },
    include: {
      filterData: {
        include: {
          filterRows: {
            include: {
              selectedTags: {
                include: {
                  type: true,
                },
              },
              selectedGenres: true,
            },
          },
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              genres: true,
              tags: {
                include: {
                  type: true
                }
              }
            }
          }
        }
      }
    }
  });

  return mapPlaylist(newPlaylist);
}

export async function getPlaylistById(id: number): Promise<Playlist> {
  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: {
      filterData: {
        include: {
          filterRows: {
            include: {
              selectedTags: {
                include: {
                  type: true,
                },
              },
              selectedGenres: true,
            },
          },
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              genres: true,
              tags: {
                include: {
                  type: true
                }
              }
            }
          }
        }
      }
    },
  });

  if (!playlist) {
    throw new Error(`Playlist with id ${id} not found`);
  }

  return mapPlaylist(playlist);
}

export async function getPlaylistsByName(term: string): Promise<Playlist[]> {
  const playlists = await prisma.playlist.findMany({
    where: { 
      name:{
        contains: term
      } 
    },
    include: {
      filterData: {
        include: {
          filterRows: {
            include: {
              selectedTags: {
                include: {
                  type: true,
                },
              },
              selectedGenres: true,
            },
          },
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              genres: true,
              tags: {
                include: {
                  type: true
                }
              }
            }
          }
        }
      }
    },
  });

  return playlists.map(mapPlaylist);
}

export async function updatePlaylist(
  id: number,
  name: string,
  description: string,
  filterDataId: number,
  tracks: {
    id?: number,
    trackId: number,
    order: number
  }[]
): Promise<Playlist> {
  const updatedPlaylist = await prisma.playlist.update({
    where: { id },
    data: {
      name,
      description,
      filterDataId,
      tracks: {
        upsert: tracks.map(track => ({
          where: { id: track.id ?? 0 },
          create: {
            trackId: track.trackId,
            order: track.order
          },
          update: {
            trackId: track.trackId,
            order: track.order
          }
        }))
      }
    },
    include: {
      filterData: {
        include: {
          filterRows: {
            include: {
              selectedTags: {
                include: {
                  type: true,
                },
              },
              selectedGenres: true,
            },
          },
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              genres: true,
              tags: {
                include: {
                  type: true
                }
              }
            }
          }
        }
      }
    }
  });

  return mapPlaylist(updatedPlaylist);
}

export async function deletePlaylist(id: number): Promise<Playlist> {
  const deletedPlaylist = await prisma.playlist.delete({
    where: { id },
    include: {
      filterData: {
        include: {
          filterRows: {
            include: {
              selectedTags: {
                include: {
                  type: true,
                },
              },
              selectedGenres: true,
            },
          },
        },
      },
      tracks: {
        include: {
          track: {
            include: {
              genres: true,
              tags: {
                include: {
                  type: true
                }
              }
            }
          }
        }
      }
    }
  });

  return mapPlaylist(deletedPlaylist);
}