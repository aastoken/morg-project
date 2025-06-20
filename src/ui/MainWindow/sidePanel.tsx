'use client';
import MenuSelector from './MenuSelector/menuSelector';
import PlaylistBrowser from './PlaylistBrowser/playlistBrowser';
import PanelTagBrowser from './TagBrowser/panelTagBrowser';
import TagGenreSelectorContainer from './tagGenreSelectorContainer';

export default function SidePanel({setPlaylistFilter, onRefreshExplorer}: 
{
  setPlaylistFilter: (f: any) => void;
  onRefreshExplorer: () => void;
})
{


  return(

    <div className="flex min-w-[280px] max-w-[300px] h-full max-h-full flex-col ">
      <div className="w-full flex flex-row items-center justify-around gap-x-2 gap-y-1 py-1 px-1 bg-zinc-300  h-14">
        <MenuSelector/>
      </div>
      <div className='flex-grow w-full overflow-hidden h-full flex-col'>
        <TagGenreSelectorContainer onRefreshExplorer={onRefreshExplorer}/>
      </div>
      <div className="flex h-[55%] min-h-[55%] w-full flex-col bg-slate-800 border-t-2 border-amber-300">
        <PlaylistBrowser setPlaylistFilter={setPlaylistFilter}/>
        
      </div>
    </div>

  );
}