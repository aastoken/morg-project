import { useDebouncedCallback } from "use-debounce";
import { DBGenre, Genre } from "../../../lib/models";
import GenreContainer from "./genreContainer";
import { useEffect, useId, useState } from "react";
import { getDBGenresByName, getGenresByName } from "../../../lib/actions";
import Popup from "reactjs-popup";




export default function PanelGenreBrowser(){

  const genres: DBGenre[] = [];
  const [data, setData] = useState(genres);
  const [genreQuery, setGenreQuery] = useState("");

  const handleSearch= useDebouncedCallback((term: string) => {
    setGenreQuery(term);
  }, 300);

  useEffect(() => {
    const getData = async () => {
      try {       
        //console.log("Tag Query:",tagQuery)
        const result = await getDBGenresByName(genreQuery);
        //console.log("Result:",result)
        
          setData(result);
        
        
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [genreQuery]);

  const popupId = useId();
  return(
    <>
    <div className="flex flex-row mb-2 mt-1 h-8 items-center justify-between ml-1 mr-2">
      <input className="flex w-2/3 h-full px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Genre Name"/>
      <Popup
          trigger={
            <button aria-describedby={popupId} className="flex h-full ml-2 rounded-sm items-center justify-center w-1/3 bg-amber-300" >ADD GENRE</button>
          }
          aria-describedby={popupId}
          modal
          nested
          contentStyle={{
            marginLeft: '285px',
            marginTop:'55px'
          }}
        >
          <div className="flex w-96 h-[415px] bg-red-500"></div>
        </Popup>
    </div>
      
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-68px)] flex flex-col items-start gap-2 pr-2 ml-1 py-1">
        
        {data.map((genre,index) => (<GenreContainer key={index} genre={genre} onGenreClick={()=>{}}/>))}
        
      </div>
    </>
  );
}