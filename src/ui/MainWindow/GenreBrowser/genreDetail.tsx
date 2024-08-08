import { Genre } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';


export default function GenreDetail({genre, onGenreClick}:{genre: Genre, onGenreClick:(genre: Genre)=>void}){

  return(
    
    <div 
    style={{ backgroundColor: genre.color }}
    className='flex items-center h-5 px-1 py-2 mr-1 rounded-sm hover:text-red-500'
    onClick={() => onGenreClick({name: genre.name, color: genre.color})}>
      {genre.name}              
    </div>      
    
  )
}