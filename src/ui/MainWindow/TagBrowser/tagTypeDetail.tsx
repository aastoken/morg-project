import { TagType } from '../../../lib/models/TagType';
import { Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';


export default function TagTypeDetail({tag_type, onTagClick}:{tag_type: TagType, onTagClick:(tag: Tag)=>void}){

  const backdropColor = hexToRgba(tag_type.color, 0.3);
  return(
    <div 
        style={{ backgroundColor: backdropColor }}
        className='flex flex-row justify-start align-text-bottom h-fit w-full max-w-full flex-wrap rounded-md'>
          <div 
          style={{ backgroundColor: tag_type.color }}
          className='flex items-center h-6 px-2 mr-1 rounded-sm'>
            {tag_type.name}
            
          </div>
          <EllipsisVerticalIcon className='w-5'/>
          <div className="flex flex-row gap-2 ">
            {tag_type.tags.map((tag, index) => (
              <div
                key={index}
                style={{ backgroundColor: tag.color }}
                className="flex rounded-md h-6 px-2 w-fit items-center cursor-pointer hover:bg-red-600"
                onClick={() => onTagClick({name: tag.name, typeName: tag.typeName, color: tag.color})}
              >
                {tag.name}
              </div>
            ))}
          </div>
          
    </div>
  )
}