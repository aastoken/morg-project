import { useEffect, useState } from 'react';
import { TagType } from '../../../lib/models/TagType';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function TagTypeContainer({tag_type,isOpenByDefault}:{tag_type:TagType, isOpenByDefault:boolean}){

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
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}