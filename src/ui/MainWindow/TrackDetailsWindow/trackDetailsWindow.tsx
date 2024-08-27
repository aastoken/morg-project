import { Track } from "../../../lib/models";


export default function TrackDetailsWindow({selectedTrack}:{selectedTrack:Track|null}){

  if (!selectedTrack) {
    return (
    <div className="flex items-center justify-center text-center h-full w-full">
      <div className="text-2xl">
      No track loaded yet
      </div>
      
    </div>)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-full w-full">
      <h2 className="text-xl">Track Details</h2>
      <p><strong>Filename:</strong> {selectedTrack.filename}</p>
      <p><strong>Artist:</strong> {selectedTrack.artist}</p>
      <p><strong>Album:</strong> {selectedTrack.album}</p>
      <p><strong>Length:</strong> {selectedTrack.length}</p>
      
    </div>
  );
}

