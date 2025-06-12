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
    <div className="flex flex-col items-top justify-left  h-full w-full mt-4 mx-4">
      <GeneralInfo selectedTrack={selectedTrack}/>
      
    </div>
  );
}

