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
    <div className="flex flex-col items-top justify-left  h-2/5 w-full p-1">
        <div className="flex flex-row w-full">
            <div className="flex flex-col w-3/6">
                <p className="text-xl"><strong>{selectedTrack.name}</strong></p>
                <p className="text-lg">{selectedTrack.artist}</p>
                <p className="text-sm text-slate-500">{selectedTrack.filename}</p>
            </div>
            <div className="flex flex-col w-1/6 h-full">
                <p className="text-xl">Genre</p>
                <div className="bg-slate-200 h-full">
                <GenresVisualizer genres={selectedTrack.genres} onGenreSelect={()=>{}} />

                </div>
            </div>
            
        </div>
            <div className="flex flex-row w-full justify-left space-x-16">
            <p><strong>Album:</strong> {selectedTrack.album}</p>
            <p><strong>Label:</strong> {selectedTrack.label}</p>
            <p><strong>Rating:</strong> {selectedTrack.rating}</p>
            </div>
    </div>
  );
}