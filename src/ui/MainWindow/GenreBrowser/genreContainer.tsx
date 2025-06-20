import Popup from "reactjs-popup";
import { DBGenre, Genre } from "../../../lib/models";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import GenreSettingsMenu from "./genreSettingsMenu";

 


export default function GenreContainer({genre, onGenreClick, onGenreChange}:{genre: DBGenre, onGenreClick: (genre: DBGenre)=>void, onGenreChange: (genre: DBGenre)=> void}){

  return(
    <div 
    style={{ backgroundColor: genre.color }}
    className="flex flex-row rounded-md w-full h-8">
    <div
        
        className="flex rounded-md w-full h-8 p-2 items-center cursor-pointer"
        onClick={() => onGenreClick({id: genre.id, name: genre.name, color: genre.color})}
      >
        {genre.name}
      </div>
      <Popup
          
          trigger={
            <button  className="flex rounded-sm items-center justify-center w-8 h-full bg-amber-300" ><PencilSquareIcon className="w-5"/></button>
          }
          
          modal
          nested
          contentStyle={{
            marginTop:'100px',
            marginLeft: '285px'
          }}
        >{(close:any)=>(
          <GenreSettingsMenu mode={"edit"} genre={genre} close = {close} onGenreChange={onGenreChange}/>
          )}
      </Popup>
    </div>
  );
}