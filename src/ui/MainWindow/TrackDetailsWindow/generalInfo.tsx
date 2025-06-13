import { DBTrack } from "../../../lib/models";
import GenresVisualizer from "../GenreBrowser/genresVisualizer";

export default function GeneralInfo({selectedTrack}:{selectedTrack:DBTrack|null}){

  if (!selectedTrack) {
    return (
    <div className="flex items-center justify-center text-center h-full w-full">
      <div className="text-2xl">
      No track loaded yet
      </div>
      
    </div>)
  }

  return (
    <div className="flex flex-col items-top justify-left  h-1/5 w-full p-1 bg-slate-100 space-y-2">
        <div className="flex flex-row w-full h-full space-x-2">
            <div className="flex flex-col  w-3/6 bg-slate-300 px-2 py-1">
                <p className="text-xl"><strong>{selectedTrack.name || "Unknown Title"}</strong></p>
                <p className="text-lg">{selectedTrack.artist || "Unknown Artist"}</p>
                <p className="text-sm text-slate-500">{selectedTrack.filename}</p>
            </div>
            <div className="flex flex-col w-6/12 h-full">
                <p className="text-xl">Genre</p>
                <div className="bg-slate-200 h-full">
                <GenresVisualizer genres={selectedTrack.genres} onGenreSelect={()=>{}} />

                </div>
            </div>
            <div className="flex flex-col flex-wrap  w-1/12 h-full bg-slate-300 px-2">
                <p className="text-xl">BPM</p>
                <p className="text-lg">{selectedTrack.bpm}</p>
                <p className="text-xl">KEY</p>
                <p className="text-lg">{selectedTrack.key}</p>
            </div>
            
        </div>
        <div className="flex flex-row w-full justify-left space-x-2">
        <p className="bg-slate-300 w-1/3 px-2"><strong>Album:</strong> {selectedTrack.album}</p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Label:</strong> {selectedTrack.label}</p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Rating:</strong> {selectedTrack.rating}</p>
        </div>
    </div>
  );
}