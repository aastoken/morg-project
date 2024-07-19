import { Tag, TagType } from "../../../lib/models";
import TagTypeDetail from "./tagTypeDetail";


export default function TagTypesVisualizer({tag_types, onTagSelect}:{tag_types: TagType[], onTagSelect:(tag: Tag)=>void}){


  return(
    <div className='flex flex-col w-full h-full'>
    {tag_types.map((tag_type, index) => (
      <TagTypeDetail key={index} tag_type={tag_type} onTagClick={onTagSelect}/>
    ))}
    </div>
  )
}