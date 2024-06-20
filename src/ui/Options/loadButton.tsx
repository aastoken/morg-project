'use client'
import loadFilenames, { generateTracks, updateDB } from "../../lib/actions/loadLibrary";

export default function LoadButton(){

  const handleLoad = async () => {
    try{
      const filenames = await loadFilenames();
      const tracks = await generateTracks(filenames);
      const result = await updateDB(tracks);
      tracks.map((track)=>{
        console.log(track);
      })
      
    } catch (error) {
      console.error('Error loading: ', error);
    }

    

  };

  return(
    <form action={handleLoad} className="flex flex-col h-fit text-lg">
      Import all the Tracks inside the Root Folder
    <button className="rounded-sm border-2 border-white p-2 bg-amber-300 border-spacing-2 hover:bg-amber-100 text-xl w-fit" >
      IMPORT LIBRARY
    </button>
    </form>
  );
}