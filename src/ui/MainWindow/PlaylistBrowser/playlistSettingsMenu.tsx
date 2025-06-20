'use client';

import { type } from "os";
import { useState, useEffect, useId } from "react";
import { FilterData, Playlist } from "../../../lib/models";
import { Button } from "../../Utils/button";
import ModalFilter from "../Filter/modalFilter";
import { FunnelIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";
import { createEmptyPlaylist, updatePlaylistWithoutFilter, getFilteredDBTracks, createPlaylistWithFilter, updatePlaylistWithFilter, deletePlaylist } from "../../../lib/actions";
import { buildTrackFilterQuery } from "../../../lib/scripts/toolbox";
import { Prisma } from "@prisma/client";
import DeleteButton from "../../Utils/deleteButton";


export default function PlaylistSettingsMenu ({
  mode, 
  playlist, 
  close, 
  onPlaylistChange
}:{
  mode: string, 
  playlist: Playlist,
  close: ()=> void, 
  onPlaylistChange: (playlist?:Playlist)=> void
}){
  const popupId = useId();
  const [headerText, setHeaderText] = useState("");
  const [confirmationButtonText, setConfirmationButtonText] = useState("");
  const [playlistData, setPlaylistData] = useState<Playlist>({
    ...playlist,
    filterData: playlist.filterData || {
      id: -1,
      allConditions: true,
      filterRows: []
    },
    tracks: playlist.tracks || [] 
  });

  const [filterData, setFilterData] = useState<FilterData>(playlist.filterData ||{
    id:-1,
    allConditions: true,
    filterRows: []
  });

  useEffect(() => {
    if (mode === "create") {
      setHeaderText("CREATE PLAYLIST");
      setConfirmationButtonText("Create New Playlist");
    } else if (mode === "edit") {
      setHeaderText("EDIT PLAYLIST");
      setConfirmationButtonText("Apply Changes");
    }
  }, [mode]);

    
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setPlaylistData({
      ...playlistData,
      [name]: value
    });
  };

  const handleApplyFilter = (appliedFilterData: FilterData) => {
    setPlaylistData(prevData => ({
      ...prevData,
      filterData: appliedFilterData
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const includeQuery = {
      
    }
    //Logic to create/update playlist goes here
    if (playlistData.filterData.filterRows.length === 0) {
      if (mode === "create") {
        await createEmptyPlaylist({
          name: playlistData.name,
          description: playlistData.description,
        });
      } else if (mode === "edit") {
        await updatePlaylistWithoutFilter({
          playlistId: playlist.id,
          name: playlistData.name,
          description: playlistData.description,
        });
      }
    } else {
      const filteredTracksQuery = buildTrackFilterQuery(
        playlistData.filterData.filterRows,
        playlistData.filterData.allConditions
      );
      const fullQuery: Prisma.trackFindManyArgs = {
        include: {
          genres: true,
          tags: {
            include:{
              type:true
            }
          }      
        },
        where: filteredTracksQuery.where
      }
      const filteredTracks = await getFilteredDBTracks(fullQuery);
  
      if (mode === "create") {
        await createPlaylistWithFilter({
          name: playlistData.name,
          description: playlistData.description,
          filterData: playlistData.filterData,
          tracks: filteredTracks,
        });
      } else if (mode === "edit") {
        await updatePlaylistWithFilter({
          playlistId: playlist.id,
          name: playlistData.name,
          description: playlistData.description,
          filterData: playlistData.filterData,
          tracks: filteredTracks,
        });
      }
    }
    
    onPlaylistChange(playlist);
    
    
    close(); // Close modal after applying
  };

  const handleDelete = async (event) =>{
    const deletedPlaylist = await deletePlaylist(playlist.id);
    console.log("Deleted Playlist: ",deletedPlaylist)
    onPlaylistChange();
    close();
  };

  const filterStatus = playlistData.filterData.filterRows.length > 0 ? "ON" : "OFF";

  return(
    <form 
    className="flex flex-col w-[300px] h-[400px] bg-slate-600 border-4 border-white"
    onSubmit={handleSubmit}>
      <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">{headerText}</div>
        {mode === "edit"?
          (<DeleteButton handleDelete={handleDelete}/>)
          :null}
      </div>
      <div className="flex flex-col h-12 items-start justify-start text-white px-1">
        Name
        <textarea
            className="w-full h-full pl-1 text-black text-start align-top resize-none"
            name="name"
            placeholder="Playlist Name..."
            value={playlistData.name}
            onChange={handleInputChange}
        />
        
      </div>
      <div className="flex flex-col items-start w-full h-24 justify-start  text-white px-1">
        Description
        <textarea
          className="w-full h-full pl-1 text-black align-top overflow-y-auto resize-none"
          name="description"
          placeholder="Description..."
          value={playlistData.description}
          onChange={handleInputChange}
        />
      </div>
      <span className="flex flex-grow flex-col items-start align-middle px-1 mt-5 "> 
        <div className="flex text-white text-xl bg-slate-900 justify-between items-center space-x-2 w-full h-8 rounded-l-sm">
          <div className="">
            PLAYLIST FILTER OPTIONS
          </div>
        {/* <div className={` text-xl px-2  rounded-r-sm  ${filterStatus === "ON" ? "bg-green-500" : "bg-red-500"}`}>
        {filterStatus}
        </div> */}
        <Popup
        trigger ={<button className="rounded-sm items-center px-4 h-full  bg-amber-300" type='button'><PencilSquareIcon className="w-6"/></button>}
        modal
        nested>
          {(close:any)=>(
          <ModalFilter
              type={'rules'}
              filterData={filterData}
              setFilterData={setFilterData}
              onApplyFilter={handleApplyFilter}
              close={close}
            />)}
        </Popup>
        </div>
        {/* <div className="text-white">
          Applying one or more conditions will turn this playlist into an automatic playlist. 
        </div> */}
                           
      </span>
      <div className="text-white">
        Number of Tracks -  {playlistData.tracks.length}
      </div> 
      <Button type="submit">{confirmationButtonText}</Button>
    </form>
  );
}