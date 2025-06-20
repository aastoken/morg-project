import { useEffect, useId, useState } from "react";
import { deleteTagTypeByName, getAllTagTypeNames, getallTagTypes, getDBTagsFromTagTypesByName } from "../../../lib/actions";
import { DBTag, DBTagType, Tag, TagType } from "../../../lib/models";
import TagTypeContainer from "./tagTypeContainer";
import { useDebouncedCallback } from "use-debounce";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";
import TagTypeSettingsMenu from "./tagTypeSettingsMenu";

export default function PanelTagBrowser({
  onRefreshExplorer, 
}: {
  onRefreshExplorer: () => void;
}){
  const tagTypes: DBTagType[] = [];
  const [data, setData] = useState(tagTypes);
  const [tagQuery, setTagQuery] = useState("");
  const [open, setOpen] = useState(false);

  const emptyTagType : DBTagType = {
    id:-1,
    color:'#ffffff',
    name:'',
    tags:[]
  }

  const handleSearch= useDebouncedCallback((term: string) => {
    setTagQuery(term);
  }, 300);

  useEffect(() => {
    const getData = async () => {
      
        if(tagQuery.length>0){
          setOpen(true);
        }
        else{
          setOpen(false);
        }        
        fetchTagTypes();
    };
    getData();
  }, [tagQuery]);

  const fetchTagTypes = async () => {
    try {
      // const deleted = await deleteTagTypeByName("pepolinos")
      // console.log("Deleted: ",deleted)
      // console.log("TagQuery: ",tagQuery)
      // const names = await getAllTagTypeNames();
      // console.log("TagType Names: ", names)
      // const allTypes = await getallTagTypes();
      // console.log("Fetched tag_types: ", JSON.stringify(allTypes))


      const result = await getDBTagsFromTagTypesByName(tagQuery);
    
      console.log("Fetched tag_types: ", JSON.stringify(result.map(t => t.name)))
      setData(result);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTagTypeChange = (updated?: DBTagType) => {
    if (updated) {
      // if it’s an existing type, replace it
      setData((prev) =>
        prev.some((t) => t.id === updated.id)
          ? prev.map((t) => t.id === updated.id ? updated : t)
          : [updated, ...prev]   // new type: prepend
      );
    }
    fetchTagTypes();
    onRefreshExplorer();
  };

  const popupId = useId();

  return(
    <>
      <div className="flex flex-row mb-2 mt-1 h-8 items-center justify-between ml-1 mr-2 ">
        <input className="flex w-2/3 h-full px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Tag Name"/>
        <Popup
            trigger={
              <button aria-describedby={popupId} className="flex h-full ml-2 rounded-sm items-center justify-center w-1/3 bg-amber-300" >ADD TYPE</button>
            }
            aria-describedby={popupId}
            modal
            nested
            contentStyle={{
              marginLeft: '300px',
              marginTop:'55px'
            }}
          >
            {(close:any)=>(
              <TagTypeSettingsMenu mode={"create"} tagType={emptyTagType} close = {close} onTagTypeChange={handleTagTypeChange}/>
            )}
            
          </Popup>
      </div>
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-68px)] flex flex-col items-start gap-2 pr-2 ml-1 py-1">
        
        {data.map((tag_type,index) => (<TagTypeContainer key={index} tag_type={tag_type} isOpenByDefault={open} onTagClick={()=>{}} onTagTypeChange={handleTagTypeChange} />))}
        
      </div>
    </>
  )
}