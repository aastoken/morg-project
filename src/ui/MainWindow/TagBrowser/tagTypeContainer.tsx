import { useEffect, useState } from 'react';
import { DBTagType, TagType } from '../../../lib/models/TagType';
import { DBTag, Tag } from '../../../lib/models';
import { hexToRgba } from '../../../lib/scripts/toolbox';
import Popup from 'reactjs-popup';
import TagTypeSettingsMenu from './tagTypeSettingsMenu';
import { PencilSquareIcon } from '@heroicons/react/24/outline';


export default function TagTypeContainer({tag_type,isOpenByDefault, onTagClick, onTagTypeChange}:{tag_type:DBTagType, isOpenByDefault:boolean, onTagClick: (tag: DBTag) => void, onTagTypeChange:(tagType?:DBTagType)=> void}){

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
      <div style={{ backgroundColor: tag_type.color }}
      className='flex flex-row rounded-md w-full h-8'>
      <div
        
        className="flex rounded-md w-full h-8 p-2 items-center cursor-pointer"
        onClick={toggleOpen}
      >
        {tag_type.name}
      </div>
      <Popup
          
          trigger={
            <button  className="flex rounded-sm items-center justify-center w-8 h-full bg-amber-300" ><PencilSquareIcon className="w-5"/></button>
          }
          
          modal
          nested
          contentStyle={{
            marginTop:'100px',
            marginLeft: '285px'
          }}
        >{(close:any)=>(
          <TagTypeSettingsMenu mode={"edit"} tagType={tag_type} close = {close} onTagTypeChange={onTagTypeChange}/>
          )}
      </Popup>
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
              onClick={() => onTagClick({id: tag.id, name: tag.name, typeId: tag.typeId, typeName: tag.typeName, color: tag.color})}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}