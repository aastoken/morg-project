'use client';
import { useEffect, useMemo, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Track, trackKeys } from '../../../lib/models/Track';
import Popup from "reactjs-popup";
import GenreBrowser from "../GenreBrowser/genreBrowser";
import TagBrowser from "../TagBrowser/tagBrowser";
import { Tag, TagType } from "../../../lib/models";
import TagTypesVisualizer from "../TagBrowser/tagTypesVisualizer";

const stringOptions = ['equals','contains','not equals','not contains']
const numberOptions = ['=','<','>','<=','>=','range']
const tagGenreOptions = ['contains all','contains some','not contains']

const dynamicOptions = {
  'File Name':stringOptions,
  'Folder':stringOptions,
  'Name':stringOptions,
  'Artist':stringOptions,
  'Length':numberOptions,
  'BPM':numberOptions,
  'Genres':tagGenreOptions,
  'Tags':tagGenreOptions,
  'Album':stringOptions,
  'Label':stringOptions,
  'Key':stringOptions,
  'Date Added':numberOptions,
  'Rating':numberOptions,
  'Comment':stringOptions,
  'Bitrate':numberOptions
  };

function getTagTypesFromTagArray(tags: Tag[]): TagType[]{
  const tagTypeMap: Map<string, TagType> = new Map();

  tags.forEach(tag => {
    if (!tagTypeMap.has(tag.typeName)) {
      tagTypeMap.set(tag.typeName, { name: tag.typeName, color: tag.color, tags: [] });
    }

    tagTypeMap.get(tag.typeName)!.tags.push(tag);
  });

  return Array.from(tagTypeMap.values());
}


export default function FilterRow({ deleteRow, setKey }: { deleteRow: () => void, setKey: number }){

  const [selectedKey, setSelectedKey] = useState<string | undefined>(trackKeys[0]);
  const [selectedComparator, setSelectedComparator] = useState<string>(stringOptions[0]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]) 

  useEffect(() => {
    // Set the default comparator based on the selected key
    setSelectedComparator(dynamicOptions[selectedKey as keyof typeof dynamicOptions]?.[0] || '');

    
    console.log("Selected Tags: ", selectedTags)
  }, [selectedKey, selectedTags]);



  const handleTagSelect = (selectedTag: Tag) => {
    setSelectedTags((prevSelectedTags) => {
      const isTagSelected = prevSelectedTags.some(
        (tag) => tag.typeName === selectedTag.typeName && tag.name === selectedTag.name
      );

      if (isTagSelected) {
        return prevSelectedTags.filter(
          (tag) => !(tag.typeName === selectedTag.typeName && tag.name === selectedTag.name)
        );
      } else {
        return [...prevSelectedTags, selectedTag];
      }
    });
  };
  

  const handleInputType = () =>{
    let element :JSX.Element = <></>;
    if(selectedComparator == 'range' && selectedKey=='Date Added'){
      element = 
      <>
        <input className="w-5/12 h-full pl-1" name="inputValueMin" type="date" placeholder="Minimum date">
        </input>
        <input className="w-5/12 h-full pl-1" name="inputValueMax" type="date" placeholder="Maximum date">
        </input>
      </>
    }
    else if (selectedComparator == 'range'){
      element = 
      <>
        <input className="w-5/12 h-full pl-1" name="inputValueMin" type="number" placeholder="Minimum value">
        </input>
        <input className="w-5/12 h-full pl-1" name="inputValueMax" type="number" placeholder="Maximum value">
        </input>
      </>
    }
    else if (numberOptions.includes(selectedComparator) && selectedKey=='Date Added'){
      element = <input className="w-full h-full pl-1" name="inputValue" type="date" placeholder="Enter value"></input>
    }
    else if (numberOptions.includes(selectedComparator)){
      element = <input className="w-full h-full pl-1" name="inputValue" type="number" placeholder="Enter value"></input>
    }
    else if (stringOptions.includes(selectedComparator) && selectedKey != 'Genres' && selectedKey != 'Tags'){
      element = <input className="w-full h-full pl-1" name="inputValue" type="text" placeholder="Enter text"></input>
    }
    else if (tagGenreOptions.includes(selectedComparator) && selectedKey == 'Genres'){
      element = <Popup trigger={<input className="w-full h-full pl-1 overflow-auto" name="inputValue" type="text" placeholder="Select Genres">
        
        </input>} modal>    
                  <div className="flex flex-col fixed w-1/3 h-1/3 top-1/3 left-1/3 bg-slate-600 border-2 p-1 pt-2">
                  <GenreBrowser/>
                  </div>
                </Popup>

    }
    else if (tagGenreOptions.includes(selectedComparator) && selectedKey == 'Tags'){
      element = <Popup trigger={<div className="w-full h-full pl-1 overflow-auto bg-slate-100" id="inputValue">
        <TagTypesVisualizer tag_types={getTagTypesFromTagArray(selectedTags)} onTagSelect={handleTagSelect}/>
      </div>} modal>    
                  <div className="flex flex-col fixed w-1/3 h-1/4 top-0 left-1/3  bg-slate-600 border-2 p-1 ">
                  <TagBrowser onTagSelect={handleTagSelect}/>
                  </div>
                </Popup>
      
    }

    return element;
  }

  return(
    <div className="flex items-center justify-between w-full h-12 bg-slate-300 px-2 py-1"> 
    
    <select 
    name = "trackKey"
    className="pl-1 w-1/6 h-5/6"
    value={selectedKey}
    onChange={(e) => setSelectedKey(e.target.value)}
    >
      {trackKeys.map((key,index) =>(
        <option 
        key={index} 
        value={key}
        
        >
          {key}
        </option>
      ))}
    </select>
    
    <select 
    className="pl-1 w-1/6 h-5/6"
    value={selectedComparator}
    onChange={(e) => setSelectedComparator(e.target.value)}
    >
        {(dynamicOptions[selectedKey as keyof typeof dynamicOptions] || []).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
    </select>
    
    <div className="flex items-center justify-evenly  w-3/6 h-5/6">
    {
      handleInputType()
    }
    </div>


    <button type="button" onClick={deleteRow} className="ml-2 p-1 bg-red-600 hover:bg-red-800 text-white rounded">
        <TrashIcon className="h-4 w-4" />
    </button>
    </div>
  );
}


export function AddCondition({ onClick }: { onClick: () => void }){

  return(
    <button type="button" onClick={onClick} className="flex w-full max-h-8 h-8 bg-slate-300 px-2 py-1">
      <PlusIcon className="flex flex-shrink max-w-6"/>
      Add Condition
    </button>
  );
}