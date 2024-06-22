'use client';
import { useEffect, useRef, useState } from 'react';
import MenuSelector from './MenuSelector/menuSelector';
import PlaylistBrowser from './PlaylistBrowser/playlistBrowser';
import TagBrowser from './TagBrowser/tagBrowser';
import GenreBrowser from './GenreBrowser/genreBrowser';

export default function SidePanel(){


  return(

    <div className="flex w-1/6 h-full max-h-full flex-col ">
      <div className="w-full flex flex-row items-center justify-around gap-x-2 py-1 pr-1 bg-zinc-300 h-14">
        <MenuSelector />
      </div>
      <div className='flex-grow w-full overflow-hidden flex-col bg-slate-400'>
        <TagBrowser />
      </div>
      <div className="flex h-[55%] min-h-[55%] w-full flex-col bg-slate-800">
        {/* <PlaylistBrowser/> */}
        <GenreBrowser />
      </div>
    </div>

  );
}