import { DBTagType, TagType } from '../../../lib/models/TagType';
import { DBTag, Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';
import { EllipsisVerticalIcon, MinusIcon, PauseIcon, SunIcon } from '@heroicons/react/24/outline';


export default function TagTypeDetail({tag_type, onTagClick}:{tag_type: DBTagType, onTagClick:(tag: DBTag)=>void}){

  const backdropColor = hexToRgba(tag_type.color, 0.5);
  return(
    <div 
        style={{ backgroundColor: backdropColor }}
        className='flex flex-wrap pr-1 justify-start items-center text-sm  w-fit max-w-full rounded-sm gap-1'>
          <div 
          style={{ backgroundColor: tag_type.color }}
          className='flex items-center h-5 px-1 py-2 mr-1 rounded-sm border-gray-950 border-2'>
            {tag_type.name}
              
          </div>
          
          
            {tag_type.tags.map((tag, index) => (
              <div
                key={index}
                style={{ backgroundColor: tag.color }}
                className="flex rounded-sm h-5 px-1 py-2 w-fit items-center text-nowrap  cursor-pointer hover:text-red-500"
                onClick={() => onTagClick({id: tag.id, name: tag.name, typeId: tag.typeId, typeName: tag.typeName, color: tag.color})}
              >
                {tag.name}
              </div>
            ))}
          
          
    </div>
  )
}