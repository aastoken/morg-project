import { Genre } from "../../../lib/models";
import GenreDetail from "./genreDetail";



export default function GenresVisualizer({genres, onGenreSelect}:{genres: Genre[], onGenreSelect:(genre: Genre)=>void}){


  return(
    <div className='flex flex-row flex-wrap py-1 items-center justify-start align-middle gap-1 w-full max-w-full '>
    {genres.map((genre, index) => (
      <GenreDetail key={index} genre={genre} onGenreClick={onGenreSelect}/>
    ))}
    </div>
  )
}