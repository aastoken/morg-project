'use client';
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Playlist } from "../../../lib/models/Playlist";
import Popup from "reactjs-popup";
import PlaylistSettingsMenu from "./playlistSettingsMenu";
import { useId } from "react";
import { FilterData } from '../../../lib/models/Filter';



export default function PlaylistContainer({
  playlist, 
  onSelect, 
  onPlaylistChange,
  isSelected
}:{
  playlist: Playlist, 
  onSelect:(playlist: Playlist)=>void, 
  onPlaylistChange:()=>void,
  isSelected: boolean
}){
  const popupId = useId();
  return(
    <div className={`flex flex-row w-full h-8 justify-between ${
      isSelected ? 'bg-amber-200' : 'bg-slate-100'
    }`}>
      <div
          className="flex rounded-sm w-5/6 h-full p-2 items-center cursor-pointer"
          onClick={()=> onSelect(playlist)}
        >
          {playlist.name}
      </div>
      <div className="flex flex-row items-center text-sm">
        <div className="px-2">
          {playlist.filterData.filterRows.length > 0 ? 'AUTO':null}
        </div>
        <Popup
          
          trigger={
            <button aria-describedby={popupId} className="flex rounded-sm items-center justify-center w-8 h-full bg-amber-300" ><PencilSquareIcon className="w-5"/></button>
          }
          aria-describedby={popupId}
          modal
          nested
          contentStyle={{
            marginLeft: '285px'
          }}
        >{(close:any)=>(
          <PlaylistSettingsMenu 
            mode={"edit"} 
            playlist={playlist} 
            close = {close} 
            onPlaylistChange = {onPlaylistChange}
            />
          )}
      </Popup>
      </div>
      
      
    </div>
  );
}