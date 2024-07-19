import { useEffect, useState } from 'react';
import { TagType } from '../../../lib/models/TagType';
import { Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';


export default function TagTypeContainer({tag_type,isOpenByDefault, onTagClick}:{tag_type:TagType, isOpenByDefault:boolean, onTagClick: (tag: Tag) => void}){

  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  useEffect(()=>{
    setIsOpen(isOpenByDefault)
  },[isOpenByDefault]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const backdropColor = hexToRgba(tag_type.color, 0.3);
  return(
    <div className="flex flex-col items-start w-full">
      <div
        style={{ backgroundColor: tag_type.color }}
        className="flex rounded-md w-full h-8 p-2 items-center cursor-pointer"
        onClick={toggleOpen}
      >
        {tag_type.name}
      </div>
      {isOpen && (
        <div
          style={{ backgroundColor: backdropColor }}
          className="flex flex-wrap gap-2 p-2 rounded-md w-full"
        >
          {tag_type.tags.map((tag, index) => (
            <div
              key={index}
              style={{ backgroundColor: tag.color }}
              className="flex rounded-md h-6 w-fit p-2 items-center mt-1 cursor-pointer"
              onClick={() => onTagClick({name: tag.name, typeName: tag.typeName, color: tag.color})}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}