'use server';
import { DBGenre, Genre } from "../models";
import prisma  from "../../../prisma/client";

//Genres--------------------------------------------------------------
export async function createGenre(genre: Genre): Promise<DBGenre>{
  const newGenre = await prisma.genre.create({
    data: genre
  });

  return newGenre;
}

export async function createGenres(genres: Genre[]){
  const newGenres = await prisma.genre.createMany({
    data: genres,
    //skipDuplicates:true 
  });

  return newGenres;  
}

export async function getDBGenres(genres:Genre[]):Promise<DBGenre[]>{
  const names = genres.map(genre => genre.name);
  const genreIds = await prisma.genre.findMany({
    where:{
      name:{
        in: names
      }
    }
  })
  return genreIds.map(result => ({id: result.id, name: result.name}));
}

export async function getAllGenres(): Promise <Genre[]>{
  return await prisma.genre.findMany();
}

export async function getAllGenreNames(): Promise<string[]>{
  const genres = await getAllGenres();
  const genreNames = genres.map(genre => genre.name);
  return genreNames;
}

export async function getGenresByName(genreName: string): Promise<Genre[]>{
  const genres = await prisma.genre.findMany({
    select:{
      name:true,
      color: true
    },
    where: {
      name: {
        contains: genreName
      }
    }
  });

  return genres.map(genre => ({name: genre.name, color: genre.color}));
}

export async function getDBGenresByName(genreName: string): Promise<DBGenre[]>{
  const genres = await prisma.genre.findMany({
    select:{
      id: true,
      name:true,
      color: true
    },
    where: {
      name: {
        contains: genreName
      }
    }
  });

  return genres.map(genre => ({id: genre.id, name: genre.name, color: genre.color}));
}

export async function updateGenre(genre: Genre){

}