'use client'
import loadFilenames, { generateTracks, updateDB } from "actions/loadLibrary";

export default function LoadButton(){

  const handleLoad = async () => {
    try{
      const filenames = await loadFilenames();
      const tracks = await generateTracks(filenames);
      const result = await updateDB(tracks);
      tracks.map((track)=>{
        //console.log(track);
      })
      
    } catch (error) {
      console.error('Error loading: ', error);
    }

    

  };

  return(
    <form action={handleLoad}>
    <button className="rounded-md border p-2 bg-teal-500 hover:bg-teal-100" >
      LOAD
    </button>
    </form>
  );
}