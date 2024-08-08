import { useDebouncedCallback } from "use-debounce";
import { Genre } from "../../../lib/models";
import GenreContainer from "./genreContainer";
import { useEffect, useState } from "react";
import { getGenresByName } from "../../../lib/actions";




export default function GenreBrowser({onGenreSelect}:{onGenreSelect :(genre: Genre)=> void}){

  const genres: Genre[] = [];
  const [data, setData] = useState(genres);
  const [genreQuery, setGenreQuery] = useState("");

  const handleSearch= useDebouncedCallback((term: string) => {
    setGenreQuery(term);
  }, 300);

  useEffect(() => {
    const getData = async () => {
      try {       
        //console.log("Tag Query:",tagQuery)
        const result = await getGenresByName(genreQuery);
        //console.log("Result:",result)
        
          setData(result);
        
        
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [genreQuery]);

  return(
    <>
      <input className="flex w-full mb-2 mt-1 h-5 px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Genre Name"></input>
      
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-38px)] flex flex-col items-start gap-2 pr-2 ml-1">
        
        {data.map((genre,index) => (<GenreContainer key={index} genre={genre} onGenreClick={onGenreSelect}/>))}
        
      </div>
    </>
  );
}