import { useState } from "react";
import PanelTagBrowser from "./TagBrowser/panelTagBrowser";
import GenreBrowser from "./GenreBrowser/genreBrowser";
import PanelGenreBrowser from "./GenreBrowser/panelGenreBrowser";



export default function TagGenreSelectorContainer (){
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
    return <PanelTagBrowser/>
  } else if (tab === 'genres') {
    return <PanelGenreBrowser />
  }
  else{
    return(<></>)
  }
};

  return(
    <>
        <div className='flex flex-row justify-around'>
          <button 
          type='button' 
          className={`border-r-2 border-white transition-all duration-200 ease-in-out rounded-t-md ${selectedTab ==="tags" ? 'w-4/6 bg-slate-200 text-black':'w-2/6 bg-slate-800 text-white'}`}
          onClick={()=>handleTabClick("tags")}
          >
            Tags
          </button>
          <button 
          type='button' 
          className={`rounded-t-md transition-all duration-200 ease-in-out ${selectedTab ==="genres" ? 'w-4/6 bg-slate-200 text-black':'w-2/6 bg-slate-800 text-white'}`}
          onClick={()=>handleTabClick("genres")}
          >
            Genres
          </button>

        </div>
        
        {renderComponent(selectedTab)}
    </>
  )
}