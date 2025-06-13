import { DBTrack } from "../../../lib/models";
import GeneralInfo from "./generalInfo";


export default function TrackDetailsWindow({selectedTrack}:{selectedTrack:DBTrack|null}){

  if (!selectedTrack) {
    return (
    <div className="flex items-center justify-center text-center h-full w-full">
      <div className="text-2xl">
      No track loaded yet
      </div>
      
    </div>)
  }

  return (
    <div className="flex flex-col items-top justify-left  h-full max-w-full pt-4 pb-2 px-4 space-y-2">
      <div className="shrink-0">
        <GeneralInfo selectedTrack={selectedTrack}/>
      </div>
      
      <div className="flex flex-col flex-grow items-top justify-left w-full p-1 bg-sky-50 border-2 border-blue-900 space-y-2">

      </div>
    </div>
  );
}

