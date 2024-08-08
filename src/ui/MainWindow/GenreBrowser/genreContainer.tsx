import { Genre } from "../../../lib/models";

 


export default function GenreContainer({genre, onGenreClick}:{genre: Genre, onGenreClick: (genre: Genre)=>void}){

  return(
    <div
        style={{ backgroundColor: genre.color }}
        className="flex rounded-md w-full h-8 p-2 items-center cursor-pointer"
        onClick={() => onGenreClick({name: genre.name, color: genre.color})}
      >
        {genre.name}
      </div>
  );
}