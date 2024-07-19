import { TagType } from '../../../lib/models/TagType';
import { Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';


export default function TagTypeDetail({tag_type, onTagClick}:{tag_type: TagType, onTagClick:(tag: Tag)=>void}){

  const backdropColor = hexToRgba(tag_type.color, 0.3);
  return(
    <div 
        style={{ backgroundColor: backdropColor }}
        className='flex flex-row items-start h-fit w-full rounded-md gap'>
          <div 
          style={{ backgroundColor: tag_type.color }}
          className='w-fit h-6 px-1 mr-1'>
            {tag_type.name}
          </div>
          
          {tag_type.tags.map((tag, index) => (
            <div
              key={index}
              style={{ backgroundColor: tag.color }}
              className="flex rounded-md h-6 w-fit p-2 items-center mt-1 cursor-pointer hover:bg-red-600"
              onClick={() => onTagClick({name: tag.name, typeName: tag.typeName, color: tag.color})}
            >
              {tag.name}
            </div>
          ))}
          
    </div>
  )
}