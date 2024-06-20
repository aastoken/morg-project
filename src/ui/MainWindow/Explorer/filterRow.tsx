'use client';
import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Track, trackKeys } from '../../../lib/models/Track';

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

export default function FilterRow({ deleteRow, setKey }: { deleteRow: () => void, setKey: number }){

  const [selectedKey, setSelectedKey] = useState<string | undefined>(trackKeys[0]);
  const [selectedComparator, setSelectedComparator] = useState<string>(stringOptions[0]);
  useEffect(() => {
    // Set the default comparator based on the selected key
    setSelectedComparator(dynamicOptions[selectedKey as keyof typeof dynamicOptions]?.[0] || '');
  }, [selectedKey]);
  const handleInputType = () =>{
    let element :JSX.Element = <></>;
    if(selectedComparator == 'range' && selectedKey=='Date Added'){
      element = 
      <>
        <input type="date" placeholder="Minimum date">
        </input>
        <input type="date" placeholder="Maximum date">
        </input>
      </>
    }
    else if (selectedComparator == 'range'){
      element = 
      <>
        <input type="number" placeholder="Minimum value">
        </input>
        <input type="number" placeholder="Maximum value">
        </input>
      </>
    }
    else if (numberOptions.includes(selectedComparator)){
      element = <input type="number" placeholder="Enter value"></input>
    }
    else if (stringOptions.includes(selectedComparator) && selectedKey != 'Genres' && selectedKey != 'Tags'){
      element = <input type="text" placeholder="Enter text"></input>
    }
    else if (tagGenreOptions.includes(selectedComparator) && selectedKey == 'Genres'){
      element = <input type="text" placeholder="Select Genres"></input>
    }
    else if (tagGenreOptions.includes(selectedComparator) && selectedKey == 'Tags'){
      element = <input type="text" placeholder="Select Tags"></input>
    }

    return element;
  }

  return(
    <div className="flex items-center justify-between w-full h-8 bg-slate-300 px-2 py-1"> 
    <div>#{`${setKey}`}</div> 
    <select 
    name = "trackKey"
    className="pl-1"
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
    className="pl-1"
    value={selectedComparator}
    onChange={(e) => setSelectedComparator(e.target.value)}
    >
        {(dynamicOptions[selectedKey as keyof typeof dynamicOptions] || []).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
    </select>
    
    {
      handleInputType()
    }
    


    <button type="button" onClick={deleteRow} className="ml-2 p-1 bg-red-600 hover:bg-red-800 text-white rounded">
        <TrashIcon className="h-4 w-4" />
    </button>
    </div>
  );
}


export function AddCondition({ onClick }: { onClick: () => void }){

  return(
    <button type="button" onClick={onClick} className="flex w-full h-8 bg-slate-300 px-2 py-1">
      <PlusIcon/>
      Add Condition
    </button>
  );
}