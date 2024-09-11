'use client';

import { useEffect, useId, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import PlaylistContainer from "./playlistContainer";
import { FilterData, Playlist } from "../../../lib/models";
import { getPlaylistsByName } from "../../../lib/actions";
import Popup from "reactjs-popup";
import PlaylistSettingsMenu from "./playlistSettingsMenu";
import { Prisma } from "@prisma/client";



export default function PlaylistBrowser({setPlaylistFilter}){
  const popupId = useId();
  
  const [isClient, setIsClient] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null); 

  useEffect(() => {
    // This will run only on the client
    setIsClient(true);
  }, []);

  const emptyPlaylist:Playlist = {
    id:-1,
    name:'',
    description:'',
    filterData:{ 
      id: -1,
      allConditions: true,
      filterRows: []
    },
    filterDataId:-1,
    tracks: []
  }
  const playlists: Playlist[] = [];
  const [data, setData] = useState(playlists);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState("");

  const handleSearch= useDebouncedCallback((term: string) => {
    setPlaylistSearchQuery(term);
  }, 300);

  const fetchPlaylists = async () => {
    try {
      const result = await getPlaylistsByName(playlistSearchQuery);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [playlistSearchQuery]);

  function getPlaylistFilterQuery ( playlist: Playlist): Prisma.trackFindManyArgs{
    const playlistFilter: Prisma.trackFindManyArgs = {
      where: {
        playlistTracks: {
          some: {
            playlistId: playlist.id
          }
        }
      }
    };
  return playlistFilter
  }
  
  const handlePlaylistChange = (playlist?: Playlist) => {
    if(!playlist){
      setPlaylistFilter({})
      setSelectedPlaylistId(null);
    }
    else{
      if(playlist.id != -1){
        setPlaylistFilter(getPlaylistFilterQuery(playlist))
        setSelectedPlaylistId(playlist.id);
      }
      
    }
    
    fetchPlaylists();
  };

  
  
  const handlePlaylistSelect = (playlist: Playlist) =>{
    setPlaylistFilter(getPlaylistFilterQuery(playlist));
    setSelectedPlaylistId(playlist.id);
  }
 
  return(
    <>
      <div className="flex flex-row items-center justify-between ml-1 mr-2 mt-1">
        <input className="flex w-2/3 mb-2 mt-1 h-8 px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Playlist Name"/>
        {isClient && (<Popup
          trigger={
            <button aria-describedby={popupId} className="flex mb-2 mt-1 rounded-sm items-center justify-center w-1/4 h-8 bg-amber-300" >CREATE</button>
          }
          aria-describedby={popupId}
          modal
          nested
          contentStyle={{
            flex:'true',
            marginLeft: '285px',
            alignSelf: "center"
          }}
        >
          {(close:any)=>(
            <PlaylistSettingsMenu 
              mode={"create"} 
              playlist={emptyPlaylist} 
              close = {close}
              onPlaylistChange = {handlePlaylistChange}/>
          )}
          
        </Popup>)}
        
      </div>
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-38px)] flex flex-col items-start gap-2 pr-2 pb-1 ml-1">
        <div
          className={`flex transition-all duration-200 ease-in-out rounded-sm w-full h-7 p-2 items-center cursor-pointer ${
            selectedPlaylistId === null ? 'bg-amber-200' : 'bg-slate-100'
          }`}
          onClick={() => {
            setPlaylistFilter({}); 
            setSelectedPlaylistId(null);
          }}
        >
          Track Collection
        </div>
        {data.map((playlist,index) => (<PlaylistContainer 
        key={index} 
        playlist={playlist} 
        onSelect={handlePlaylistSelect} 
        onPlaylistChange = {handlePlaylistChange} 
        isSelected={selectedPlaylistId === playlist.id}/>))}

      </div>
    </>
  );
}