import { Genre } from "../../../lib/models";

 


export default function GenreContainer({genre}:{genre: Genre}){

  return(
    <div
        style={{ backgroundColor: genre.color }}
        className="flex rounded-md w-full h-8 p-2 items-center cursor-pointer"
        //onClick={}
      >
        {genre.name}
      </div>
  );
}