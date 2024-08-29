import { useEffect, useState } from "react";
import { getDBTagsFromTagTypesByName } from "../../../lib/actions";
import { DBTag, DBTagType, Tag, TagType } from "../../../lib/models";
import TagTypeContainer from "./tagTypeContainer";
import { useDebouncedCallback } from "use-debounce";

export default function TagBrowser({onTagSelect}:{onTagSelect :(tag: DBTag)=> void}){
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

  
  return(
    <>
      <input className="flex w-full mb-2 mt-1 h-5 px-2 bg-slate-300" onChange={(e) => handleSearch(e.target.value)} placeholder="Search Tag Name"></input>
      
      <div className="overflow-y-auto min-h-0 max-h-[calc(100%-38px)] flex flex-col items-start gap-2 pr-2 ml-1">
        
        {data.map((tag_type,index) => (<TagTypeContainer key={index} tag_type={tag_type} isOpenByDefault={open} onTagClick={onTagSelect}/>))}
        
      </div>
    </>
  )
}