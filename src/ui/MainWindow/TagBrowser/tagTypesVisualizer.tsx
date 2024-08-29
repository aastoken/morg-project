import { DBTag, DBTagType, Tag, TagType } from "../../../lib/models";
import TagTypeDetail from "./tagTypeDetail";


export default function TagTypesVisualizer({tag_types, onTagSelect}:{tag_types: DBTagType[], onTagSelect:(tag: DBTag)=>void}){


  return(
    <div className='flex flex-col justify-start py-1 gap-1 w-full max-w-full h-full'>
    {tag_types.map((tag_type, index) => (
      <TagTypeDetail key={index} tag_type={tag_type} onTagClick={onTagSelect}/>
    ))}
    </div>
  )
}