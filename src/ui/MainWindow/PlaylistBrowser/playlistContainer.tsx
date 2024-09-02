import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Playlist } from "../../../lib/models/Playlist";
import Popup from "reactjs-popup";
import PlaylistSettingsMenu from "./playlistSettingsMenu";
import { useId } from "react";



export default function PlaylistContainer({playlist}:{playlist: Playlist}){
  const popupId = useId();
  return(
    <div className = "flex flex-row w-full h-8 justify-between">
      <div
          className="flex rounded-sm w-5/6 h-full p-2 items-center cursor-pointer"
          onClick={() => {}}
        >
          {playlist.name}
      </div>
      <Popup
          
          trigger={
            <button aria-describedby={popupId} className="flex rounded-sm items-center justify-center w-5 h-full bg-amber-300" ><PencilSquareIcon className="w-5"/></button>
          }
          aria-describedby={popupId}
          modal
          nested
          contentStyle={{
            marginLeft: '285px',
            marginBottom: '4%'
          }}
        >{(close:any)=>(
          <PlaylistSettingsMenu mode={"edit"} playlist={playlist} close = {close}/>
          )}
      </Popup>
      
    </div>
  );
}