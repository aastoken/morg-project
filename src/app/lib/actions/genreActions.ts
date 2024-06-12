import { DBGenre, Genre } from "lib/models";
import { prisma } from "../../../../prisma/client";

//Genres--------------------------------------------------------------
export async function createGenre(genre: Genre): Promise<DBGenre>{
  const newGenre = await prisma.genre.create({
    data: genre
  });

  return newGenre;
}

export async function createGenres(genres: Genre[]){
  const newGenres = await prisma.genre.createMany({
    data: genres
  });

  return newGenres;  
}

export async function getAllGenres(): Promise <Genre[]>{
  return await prisma.genre.findMany();
}

export async function getAllGenreNames(): Promise<string[]>{
  const genres = await getAllGenres();
  const genreNames = genres.map(genre => genre.name);
  return genreNames;
}

export async function updateGenre(genre: Genre){

}