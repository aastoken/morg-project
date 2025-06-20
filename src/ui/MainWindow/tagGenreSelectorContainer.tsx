import { useState } from "react";
import PanelTagBrowser from "./TagBrowser/panelTagBrowser";
import GenreBrowser from "./GenreBrowser/genreBrowser";
import PanelGenreBrowser from "./GenreBrowser/panelGenreBrowser";



export default function TagGenreSelectorContainer ({
  onRefreshExplorer,
}: {
  onRefreshExplorer: () => void;
}){
const [selectedTab, setSelectedTab] = useState("tags");

const handleTabClick = (tab:string)=>{
  if(tab === "tags"){
    setSelectedTab("tags")
  }
  else if (tab === "genres"){
    setSelectedTab("genres")
  }
  console.log("Selected Tab",selectedTab)
}

const renderComponent = (tab: string) => {
  if (tab === 'tags') {
    return <PanelTagBrowser onRefreshExplorer={onRefreshExplorer}/>
  } else if (tab === 'genres') {
    return <PanelGenreBrowser onRefreshExplorer={onRefreshExplorer}/>
  }
  else{
    return(<></>)
  }
};

  return(
    <div className="bg-slate-800 h-full">
        <div className='flex flex-row justify-around  bg-zinc-300'>
          <button 
          type='button' 
          className={`border-r-2 border-white transition-all duration-200 ease-in-out rounded-t-md ${selectedTab ==="tags" ?'w-4/6 bg-slate-800 text-white':'w-2/6 bg-slate-200 text-black'}`}
          onClick={()=>handleTabClick("tags")}
          >
            Tags
          </button>
          <button 
          type='button' 
          className={`rounded-t-md transition-all duration-200 ease-in-out ${selectedTab ==="genres" ? 'w-4/6 bg-slate-800 text-white':'w-2/6 bg-slate-200 text-black'}`}
          onClick={()=>handleTabClick("genres")}
          >
            Genres
          </button>

        </div>
        
        {renderComponent(selectedTab)}
        
        
    </div>
  )
}