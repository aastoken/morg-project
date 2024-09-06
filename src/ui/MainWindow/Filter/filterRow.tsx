'use client';
import { useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Track, trackKeys } from '../../../lib/models/Track';
import Popup from "reactjs-popup";
import GenreBrowser from "../GenreBrowser/genreBrowser";
import TagBrowser from "../TagBrowser/tagBrowser";
import { DBGenre, DBTag, DBTagType, FilterRow, Genre, Tag, TagType } from "../../../lib/models";
import TagTypesVisualizer from "../TagBrowser/tagTypesVisualizer";
import GenresVisualizer from "../GenreBrowser/genresVisualizer";
import { getTagTypesFromTagArray } from "../../../lib/scripts/toolbox";

const stringOptions = ['contains','not contains','equals','not equals']
const numberOptions = ['<','>','=','<=','>=','range']
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



export default function FilterRowComponent({ rowData, deleteRow, updateRow }: { rowData: FilterRow; deleteRow: () => void; updateRow: (updatedData: Partial<FilterRow>) => void; }) {

  const handleTagSelect = (selectedTag: DBTag) => {
    updateRow({
      selectedTags: rowData.selectedTags.some(tag => tag.name === selectedTag.name)
        ? rowData.selectedTags.filter(tag => tag.name !== selectedTag.name)
        : [...rowData.selectedTags, selectedTag]
    });
  };

  const handleGenreSelect = (selectedGenre: DBGenre) => {
    updateRow({
      selectedGenres: rowData.selectedGenres.some(genre => genre.name === selectedGenre.name)
        ? rowData.selectedGenres.filter(genre => genre.name !== selectedGenre.name)
        : [...rowData.selectedGenres, selectedGenre]
    });
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateRow({ [name]: value });
  };

  const handleInputType = () =>{
    let element :JSX.Element = <></>;
    if(rowData.selectedComparator == 'range' && rowData.selectedKey=='Date Added'){
      element = 
      <>
          <input
            className="w-5/12 h-full pl-1"
            name="inputValueMin"
            type="date"
            placeholder="Minimum date"
            value={rowData.inputValueMin || ''}
            onChange={handleInputChange}
          />
          <input
            className="w-5/12 h-full pl-1"
            name="inputValueMax"
            type="date"
            placeholder="Maximum date"
            value={rowData.inputValueMax || ''}
            onChange={handleInputChange}
          />
        </>
    }
    else if (rowData.selectedComparator == 'range'){
      element = 
      <>
          <input
            className="w-5/12 h-full pl-1"
            name="inputValueMin"
            type="number"
            placeholder="Minimum value"
            value={rowData.inputValueMin || ''}
            onChange={handleInputChange}
          />
          <input
            className="w-5/12 h-full pl-1"
            name="inputValueMax"
            type="number"
            placeholder="Maximum value"
            value={rowData.inputValueMax || ''}
            onChange={handleInputChange}
          />
        </>
    }
    else if (numberOptions.includes(rowData.selectedComparator) && rowData.selectedKey=='Date Added'){
      element = <input
        className="w-full h-full pl-1"
        name="inputValue"
        type="date"
        placeholder="Enter value"
        value={rowData.inputValue || ''}
        onChange={handleInputChange}
      />
    }
    else if (numberOptions.includes(rowData.selectedComparator)){
      element = <input
        className="w-full h-full pl-1"
        name="inputValue"
        type="number"
        placeholder="Enter value"
        value={rowData.inputValue || ''}
        onChange={handleInputChange}
      />
    }
    else if (stringOptions.includes(rowData.selectedComparator) && rowData.selectedKey != 'Genres' && rowData.selectedKey != 'Tags'){
      element = <input
        className="w-full h-full pl-1"
        name="inputValue"
        type="text"
        placeholder="Enter text"
        value={rowData.inputValue || ''}
        onChange={handleInputChange}
      />
    }
    else if (tagGenreOptions.includes(rowData.selectedComparator) && rowData.selectedKey == 'Genres'){
      element = <div className="flex w-full max-w-full h-full">
                  <div className="flex-grow pl-1 content-center overflow-y-auto bg-slate-100" id="inputValue">
                    <GenresVisualizer genres={rowData.selectedGenres} onGenreSelect={handleGenreSelect}/>
                  </div>
                  <Popup trigger={<div className="flex w-1/12 h-full p-1 justify-center bg-amber-300" id="inputValue"><PencilSquareIcon className="w-5"/></div>} 
                  modal
                  nested
                  position={['right center']}
                  contentStyle={{
                   marginRight: '50px'
                 }}
                  >    
                    <div className="flex flex-col relative justify-start w-[400px] max-h-[400px] top-0  bg-slate-600 border-2 p-1 ">
                      <GenreBrowser onGenreSelect={handleGenreSelect}/>
                    </div>
                  </Popup>
                </div>
    }
    else if (tagGenreOptions.includes(rowData.selectedComparator) && rowData.selectedKey == 'Tags'){
      element = <div className="flex w-full max-w-full h-full">
                  <div className="flex-grow pl-1 align-middle overflow-y-auto bg-slate-100" id="inputValue">
                    <TagTypesVisualizer tag_types={getTagTypesFromTagArray(rowData.selectedTags)} onTagSelect={handleTagSelect}/>
                  </div>
                  <Popup 
                  trigger={<div className="flex w-1/12 h-full p-1 justify-center bg-amber-300" id="inputValue"><PencilSquareIcon className="w-5"/></div>}                   
                  modal
                  nested
                  position={['right center']}
                  contentStyle={{
                   marginRight: '50px'
                 }}
                  >    
                    <div className="flex flex-col relative justify-start w-[400px] max-h-[400px] top-0  bg-slate-600 border-2 p-1 ">
                      <TagBrowser onTagSelect={handleTagSelect}/>
                    </div>
                  </Popup>
                </div>
    }

    return element;
  }

  return(
    <div className="flex items-center justify-between w-full min-h-16 h-16 bg-slate-300 px-2 py-1"> 
    
      <select 
      name = "trackKey"
      className="pl-1 w-1/6 h-5/6"
      value={rowData.selectedKey}
      onChange={(e) => {
        const newKey = e.target.value;
        const newComparator = dynamicOptions[newKey]?.[0] || '';
        updateRow({ selectedKey: newKey, selectedComparator: newComparator });
      }}
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
      value={rowData.selectedComparator}
      onChange={(e) => updateRow({ selectedComparator: e.target.value })}
      >
          {(dynamicOptions[rowData.selectedKey as keyof typeof dynamicOptions] || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
      </select>
      
      <div className="flex items-center justify-evenly  w-3/6 h-[90%]">
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