import { DBGenre, Genre } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';


export default function GenreDetail({genre, onGenreClick}:{genre: DBGenre, onGenreClick:(genre: DBGenre)=>void}){

  return(
    
    <div 
    style={{ backgroundColor: genre.color }}
    className='flex items-center h-5 px-1 py-2 mr-1 rounded-sm hover:text-red-500'
    onClick={() => onGenreClick({id: genre.id, name: genre.name, color: genre.color})}>
      {genre.name}              
    </div>      
    
  )
}