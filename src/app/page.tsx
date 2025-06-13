'use client';
import { DBTrack } from '../lib/models';
import Explorer from '../ui/MainWindow/Explorer/explorer';
import TrackDetailsWindow from '../ui/MainWindow/TrackDetailsWindow/trackDetailsWindow';
import SidePanel from '../ui/MainWindow/sidePanel';
import { useEffect, useState } from 'react';


export default function Home() {
  
  const [playlistFilter, setPlaylistFilter] = useState<any>({});
  const [selectedTrack, setSelectedTrack] = useState<DBTrack | null>(null);

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
      <SidePanel setPlaylistFilter = {setPlaylistFilter}/>
      
      <div className="flex flex-col flex-shrink h-full overflow-hidden">
   
        <div className="flex flex-grow min-h-[45%] bg-zinc-300 border-l-2 border-amber-300">
          <TrackDetailsWindow selectedTrack = {selectedTrack}/>
        </div>

        <div className="flex-grow overflow-hidden"> 
          <Explorer playlistFilter = {playlistFilter} onTrackSelect = {setSelectedTrack}/>
        </div>
        
      </div>     
    </div> 
  );
}
