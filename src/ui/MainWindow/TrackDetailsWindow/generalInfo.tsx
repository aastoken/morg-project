import { useEffect, useState } from "react";
import { DBTagType, DBTrack } from "../../../lib/models";
import { getTagTypesFromTagArray } from "../../../lib/scripts/toolbox";
import GenresVisualizer from "../GenreBrowser/genresVisualizer";
import TagTypesVisualizer from "../TagBrowser/tagTypesVisualizer";

export default function GeneralInfo({selectedTrack}:{selectedTrack:DBTrack|null}){
    const [tagTypes, setTagTypes] = useState<DBTagType[]>([]);
    useEffect(() => {
        if (selectedTrack) {
          const updatedTagTypes = getTagTypesFromTagArray(selectedTrack.tags);
          setTagTypes(updatedTagTypes);
        } else {
          setTagTypes([]); // clear if no track
        }
      }, [selectedTrack]);
    
  if (!selectedTrack) {
    return (
    <div className="flex flex-col items-top justify-left  w-full p-1 bg-slate-100 space-y-2">
        <div className="flex flex-row w-full space-x-2">
            <div className="flex flex-col  w-3/6 bg-slate-300 px-2 py-1">
                <p className="text-xl"><strong>Title</strong></p>
                <p className="text-lg">Artist</p>
                <p className="text-sm text-slate-500">File name</p>
            </div> 
            <div className="flex flex-col flex-wrap  w-1/12 h-full bg-slate-300 px-2">
                <p className="text-xl">BPM</p>
                <p className="text-lg">0</p>
                <p className="text-xl">KEY</p>
                <p className="text-lg">None</p>
            </div>
            <div className="flex flex-col w-1/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Genre</p>
                <div className="bg-slate-200 h-full">
                

                </div>
            </div>
            <div className="flex flex-col w-5/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Tags</p>
                <div className="bg-slate-200 h-full">
                

                </div>
            </div>
           
            
        </div>
        <div className="flex flex-row w-full justify-left space-x-2">
        <p className="bg-slate-300 w-1/3 px-2"><strong>Album:</strong> </p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Label:</strong>  </p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Rating:</strong>  </p>
        </div>
    </div>)
  }

  return (
    
    <div className="flex flex-col items-top justify-left  w-full p-1 bg-slate-100 space-y-2">
        <div className="flex flex-row w-full space-x-2">
            <div className="flex flex-col  w-3/6 bg-slate-300 px-2 py-1">
                <p className="text-xl"><strong>{selectedTrack.name || "Unknown Title"}</strong></p>
                <p className="text-lg">{selectedTrack.artist || "Unknown Artist"}</p>
                <p className="text-sm text-slate-500">{selectedTrack.filename}</p>
            </div> 
            <div className="flex flex-col flex-wrap  w-1/12 h-full bg-slate-300 px-2">
                <p className="text-xl">BPM</p>
                <p className="text-lg">{selectedTrack.bpm}</p>
                <p className="text-xl">KEY</p>
                <p className="text-lg">{selectedTrack.key}</p>
            </div>
            <div className="flex flex-col w-1/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Genre</p>
                <div className="bg-slate-200 h-full">
                <GenresVisualizer genres={selectedTrack.genres} onGenreSelect={()=>{}} />

                </div>
            </div>
            <div className="flex flex-col w-5/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Tags</p>
                <div className="bg-slate-200 h-full">
                <TagTypesVisualizer tag_types={tagTypes} onTagSelect={()=>{}} />

                </div>
            </div>
           
            
        </div>
        <div className="flex flex-row w-full justify-left space-x-2">
        <p className="bg-slate-300 w-1/3 px-2"><strong>Album:</strong> {selectedTrack.album || "Unknown"}</p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Label:</strong> {selectedTrack.label || "Unknown"}</p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Rating:</strong> {selectedTrack.rating || "Unknown"}</p>
        </div>
    </div>
    
   
  );
}