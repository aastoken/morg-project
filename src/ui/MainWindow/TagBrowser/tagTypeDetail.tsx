import { TagType } from '../../../lib/models/TagType';
import { Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';


export default function TagTypeDetail({tag_type, onTagClick}:{tag_type: TagType, onTagClick:(tag: Tag)=>void}){

  const backdropColor = hexToRgba(tag_type.color, 0.5);
  return(
    <div 
        style={{ backgroundColor: backdropColor }}
        className='flex flex-wrap justify-start align-text-bottom text-sm  w-full max-w-full rounded-md gap-1'>
          <div 
          style={{ backgroundColor: tag_type.color }}
          className='flex items-center h-4 px-1 mr-1 rounded-sm'>
            {tag_type.name}
            <EllipsisVerticalIcon className='w-4'/>  
          </div>
          
          
            {tag_type.tags.map((tag, index) => (
              <div
                key={index}
                style={{ backgroundColor: tag.color }}
                className="flex rounded-sm h-4 px-1 w-fit items-center text-nowrap  cursor-pointer hover:text-red-500"
                onClick={() => onTagClick({name: tag.name, typeName: tag.typeName, color: tag.color})}
              >
                {tag.name}
              </div>
            ))}
          
          
    </div>
  )
}