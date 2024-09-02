'use client';

import { type } from "os";
import { useState, useEffect, useId } from "react";
import { Playlist } from "../../../lib/models";
import { Button } from "../../button";
import ModalFilter from "../Filter/modalFilter";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";


export default function PlaylistSettingsMenu ({mode, playlist, close}:{mode:string, playlist: Playlist, close: ()=> void}){
  const popupId = useId();
  const [headerText, setHeaderText] = useState("");
  const [confirmationButtonText, setConfirmationButtonText] = useState("");
  const [playlistData, setPlaylistData] = useState<Playlist>(playlist)
  const [playlistAdvancedFilter, setPlaylistAdvancedFilter] = useState({})

    useEffect(() => {
      if (mode === "create") {
        setHeaderText("CREATE PLAYLIST");
        setConfirmationButtonText("Create New Playlist");
      } else if (mode === "edit") {
        setHeaderText("EDIT PLAYLIST");
        setConfirmationButtonText("Apply Changes");
      }
    }, [type]);

    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      //setPlaylistData({ [name]: value });
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      //Logic to create/update playlist goes here
      if (mode === "create") {
        
      } else if (mode === "edit") {

      }
      close(); // Close modal after applying
    };
  return(
    <form 
    className="flex flex-col w-[750px] h-[500px] bg-slate-600 border-4 border-white"
    onSubmit={handleSubmit}>
      <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">{headerText}</div>
      </div>
      <div className="flex flex-col items-start justify-start text-white pl-1">
        Name
        <input
            className="w-5/12 h-full pl-1"
            name="playlistName"
            type="text"
            placeholder="Playlist Name..."
            value={''}
            onChange={handleInputChange}>
        </input>
      </div>
      <div className="flex flex-col items-start h-16 justify-start text-white pl-1">
        Description
        <input
            className="w-11/12 h-full pl-1"
            name="playlistName"
            type="text"
            placeholder="Description..."
            value={''}
            onChange={handleInputChange}>
        </input>
      </div>
      <span className="flex flex-grow pl-1 mt-16 gap-3 text-white">
        Click to Add a custom Rule set to the playlist. Warning: This will turn the playlist into an Automatic Playlist.
        <Popup
        trigger={
          <button aria-describedby={popupId} className="flex w-fit h-fit p-2 bg-white text-black">
            <FunnelIcon className="flex w-[24px]" />
          </button>
        }
        aria-describedby={popupId}
        modal
        nested
      >
        {(close: any) => (
          
          <ModalFilter
            type={'rules'}
            setAdvancedFilter={setPlaylistAdvancedFilter}
            filterRowsData={playlist.filterData.filterRows}
            setFilterRowsData={setPlaylistData}
            allConditions={playlist.filterData.allConditions}
            setAllConditions={setPlaylistData}
            close={close}
          />
          
        )}
      </Popup>
      </span>
      <Button type="submit">{confirmationButtonText}</Button>
    </form>
  );
}