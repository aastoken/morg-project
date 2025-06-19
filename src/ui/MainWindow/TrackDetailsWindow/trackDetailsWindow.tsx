import { DBTrack } from "../../../lib/models";
import AudioPlayer from "./audioPlayer";
import GeneralInfo from "./generalInfo";


export default function TrackDetailsWindow({selectedTrack, onSave}:{selectedTrack:DBTrack|null, onSave: () => void;}){

  

  return (
    <div className="flex flex-col items-top justify-left  h-full max-w-full pt-4 pb-2 px-4 space-y-2">
      <div className="shrink-0">
        <GeneralInfo selectedTrack={selectedTrack} onSave={onSave}/>
      </div>
      
      <div className="flex flex-col flex-grow items-top justify-left w-full p-1 overflow-hidden bg-sky-50 border-2 border-blue-900 space-y-2">
        <AudioPlayer selectedTrack={selectedTrack}/>
      </div>
    </div>
  );
}

