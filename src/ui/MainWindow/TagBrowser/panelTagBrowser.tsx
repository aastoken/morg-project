import { useEffect, useId, useState } from "react";
import { getDBTagsFromTagTypesByName } from "../../../lib/actions";
import { DBTag, DBTagType, Tag, TagType } from "../../../lib/models";
import TagTypeContainer from "./tagTypeContainer";
import { useDebouncedCallback } from "use-debounce";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";

export default function PanelTagBrowser(){
  const tagTypes: DBTagType[] = [];
  const [data, setData] = useState(tagTypes);
  const [tagQuery, setTagQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch= useDebouncedCallback((term: string) => {
    setTagQuery(term);
  }, 300);

  useEffect(() => {
    const getData = async () => {
      try {
        if(tagQuery.length>0){
          setOpen(true);
        }
        else{
          setOpen(false);
        }
        //console.log("Tag Query:",tagQuery)
        const result = await getDBTagsFromTagTypesByName(tagQuery);
        //console.log("Result:",result)
        
          setData(result);
        
        
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [tagQuery]);

  const popupId = useId();
  return(
    <>
    <div className="flex flex-row mb-2 mt-1 h-8 items-center justify-between ml-1 mr-2">
      <input className="flex w-2/3 h-full px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Tag Name"/>
      <Popup
          trigger={
            <button aria-describedby={popupId} className="flex h-full rounded-sm items-center justify-center w-1/4 bg-amber-300" >ADD TAG</button>
          }
          aria-describedby={popupId}
          modal
          nested
          contentStyle={{
            marginLeft: '285px',
            marginTop:'55px'
          }}
        >
          <div className="flex w-96 h-[415px] bg-red-500"></div>
        </Popup>
    </div>
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-38px)] flex flex-col items-start gap-2 pr-2 ml-1">
        
        {data.map((tag_type,index) => (<TagTypeContainer key={index} tag_type={tag_type} isOpenByDefault={open} onTagClick={()=>{}} allowEdit = {true}/>))}
        
      </div>
    </>
  )
}