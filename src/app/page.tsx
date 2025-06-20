'use client';
import { DBTrack } from '../lib/models';
import Explorer from '../ui/MainWindow/Explorer/explorer';
import TrackDetailsWindow from '../ui/MainWindow/TrackDetailsWindow/trackDetailsWindow';
import SidePanel from '../ui/MainWindow/sidePanel';
import { useEffect, useState } from 'react';


export default function Home() {
  
  const [playlistFilter, setPlaylistFilter] = useState<any>({});
  const [selectedTrack, setSelectedTrack] = useState<DBTrack | null>(null);
  const [explorerRefreshKey, setExplorerRefreshKey] = useState(0);
  const triggerExplorerRefresh = () => {
    setExplorerRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTrack(null); // Clear the selected track when Escape is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className='flex w-full h-full'>
      <SidePanel setPlaylistFilter = {setPlaylistFilter} onRefreshExplorer={triggerExplorerRefresh}/>
      
      <div className="flex flex-col flex-grow h-full w-0 overflow-hidden">
   
        <div className="basis-[45%] max-h-[45%] flex-none bg-zinc-300 border-l-2 border-amber-300">
          <TrackDetailsWindow 
            selectedTrack = {selectedTrack} 
            onSave={triggerExplorerRefresh}/>
        </div>

        <div className="flex-grow overflow-hidden"> 
          <Explorer 
            playlistFilter = {playlistFilter} 
            onTrackSelect = {setSelectedTrack} 
            refreshKey={explorerRefreshKey}/>
        </div>
        
      </div>     
    </div> 
  );
}
