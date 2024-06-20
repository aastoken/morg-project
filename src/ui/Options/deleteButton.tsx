'use client'
import { deleteAllTracks } from "../../lib/actions";

export default function DeleteTracksButton(){

  const handleDelete = async () =>{
    await deleteAllTracks();
  }


  return(
    <form action={handleDelete} className="flex flex-col h-fit text-lg">
      Delete all the Tracks from the DB
    <button className="rounded-sm border-2 border-white p-2 bg-red-700 border-spacing-2 hover:bg-red-300 text-xl w-fit" >
      DELETE LIBRARY
    </button>
    </form>
  );
}