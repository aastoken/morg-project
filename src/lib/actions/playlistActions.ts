'use server';
import prisma  from "../../../prisma/client";
import { DBTrack, FilterData, Playlist } from "../models";
import { mapPlaylist } from "../scripts";

// export async function createPlaylist(
//   name: string,
//   description: string,
//   filterDataId: number,
//   tracks: {
//     trackId: number,
//     order: number
//   }[]
// ): Promise<Playlist> {
//   const newPlaylist = await prisma.playlist.create({
//     data: {
//       name,
//       description,
//       filterDataId,
//       tracks: {
//         create: tracks.map(track => ({
//           trackId: track.trackId,
//           order: track.order
//         }))
//       }
//     },
//     include: {
//       filterData: {
//         include: {
//           filterRows: {
//             include: {
//               selectedTags: {
//                 include: {
//                   type: true,
//                 },
//               },
//               selectedGenres: true,
//             },
//           },
//         },
//       },
//       tracks: {
//         include: {
//           track: {
//             include: {
//               genres: true,
//               tags: {
//                 include: {
//                   type: true
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   });

//   return mapPlaylist(newPlaylist);
// }

export async function createEmptyPlaylist({
  name,
  description,
}: {
  name: string;
  description: string;
}): Promise<Playlist> {
  const newPlaylist = await prisma.playlist.create({
    data: {
      name,
      description,
      filterData: {
        create: {
          allConditions: true
        },
      },
    },
    include:{
      filterData: {
        include:{
          filterRows: true
        }
      },
      tracks: true
    }
  });

  console.log("New Empty Playlist Created: ", newPlaylist);
  return mapPlaylist(newPlaylist);
}

export async function createPlaylistWithFilter({
  name,
  description,
  filterData,
  tracks = [],
}: {
  name: string;
  description: string;
  filterData: FilterData;
  tracks: DBTrack[];
}): Promise<Playlist> {
  const newPlaylist = await prisma.playlist.create({
    data: {
      name,
      description,
      filterData: {
        create: {
          allConditions: filterData.allConditions,
          filterRows: {
            create: filterData.filterRows.map((row) => ({
              selectedKey: row.selectedKey,
              selectedComparator: row.selectedComparator,
              inputValue: row.inputValue,
              inputValueMin: row.inputValueMin,
              inputValueMax: row.inputValueMax,
              selectedTags: {
                connect: row.selectedTags?.map((tag) => ({ id: tag.id })),
              },
              selectedGenres: {
                connect: row.selectedGenres?.map((genre) => ({
                  id: genre.id,
                })),
              },
            })),
          },
        },
      },
      tracks: {
        create: tracks.map((track, index) => ({
          track: { connect: { id: track.id } },
          order: index + 1,
        })),
      },
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
          }
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

  console.log("New Playlist Created: ", newPlaylist);
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

// export async function updatePlaylist(
//   id: number,
//   name: string,
//   description: string,
//   filterDataId: number,
//   tracks: {
//     id?: number,
//     trackId: number,
//     order: number
//   }[]
// ): Promise<Playlist> {
//   const updatedPlaylist = await prisma.playlist.update({
//     where: { id },
//     data: {
//       name,
//       description,
//       filterDataId,
//       tracks: {
//         upsert: tracks.map(track => ({
//           where: { id: track.id ?? 0 },
//           create: {
//             trackId: track.trackId,
//             order: track.order
//           },
//           update: {
//             trackId: track.trackId,
//             order: track.order
//           }
//         }))
//       }
//     },
//     include: {
//       filterData: {
//         include: {
//           filterRows: {
//             include: {
//               selectedTags: {
//                 include: {
//                   type: true,
//                 },
//               },
//               selectedGenres: true,
//             },
//           },
//         },
//       },
//       tracks: {
//         include: {
//           track: {
//             include: {
//               genres: true,
//               tags: {
//                 include: {
//                   type: true
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   });

//   return mapPlaylist(updatedPlaylist);
// }

export async function updatePlaylistWithoutFilter({
  playlistId,
  name,
  description,
}: {
  playlistId: number;
  name: string;
  description: string;
}): Promise<Playlist> {
  const updatedPlaylist = await prisma.playlist.update({
    where: { id: playlistId },
    data: {
      name,
      description,
      filterData: {
        update: {
          allConditions: true,
          filterRows: {
            deleteMany: {}, // Clear any existing filterRows
          },
        },
      },
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
          }
        },
      },
      tracks: {
        include:{
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

  console.log("Updated Playlist Without Filter: ", updatedPlaylist);
  return mapPlaylist(updatedPlaylist);
}

export async function updatePlaylistWithFilter({
  playlistId,
  name,
  description,
  filterData,
  tracks = [],
}: {
  playlistId: number;
  name: string;
  description: string;
  filterData: FilterData;
  tracks: DBTrack[];
}): Promise<Playlist> {
  const updatedPlaylist = await prisma.playlist.update({
    where: { id: playlistId },
    data: {
      name,
      description,
      filterData: {
        update: {
          allConditions: filterData.allConditions,
          filterRows: {
            deleteMany: {}, // Clear any existing filterRows
            create: filterData.filterRows.map((row) => ({
              selectedKey: row.selectedKey,
              selectedComparator: row.selectedComparator,
              inputValue: row.inputValue,
              inputValueMin: row.inputValueMin,
              inputValueMax: row.inputValueMax,
              selectedTags: {
                connect: row.selectedTags?.map((tag) => ({ id: tag.id })),
              },
              selectedGenres: {
                connect: row.selectedGenres?.map((genre) => ({
                  id: genre.id,
                })),
              },
            })),
          },
        },
      },
      tracks: {
        deleteMany: { playlistId }, // Clear all tracks in this playlist before adding the new ones
        create: tracks.map((track, index) => ({
          track: { connect: { id: track.id } },
          order: index + 1,
        })),
      },
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
          }
        },
      },
      tracks: {
        include:{
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

  console.log("Updated Playlist: ", updatedPlaylist);
  return mapPlaylist(updatedPlaylist);;
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