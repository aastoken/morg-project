'use client';

import { useEffect, useState } from "react";
import { DBTagType } from "../../../lib/models";
import DeleteButton from "../../Utils/deleteButton";
import { deleteTagType } from "../../../lib/actions";
import { ColorPicker, useColor, IColor } from "react-color-palette";
import "react-color-palette/css";
import Popup from "reactjs-popup";
import { Button } from "../../Utils/button";
import TagSettingsMenu from "./tagSettingsMenu";

export default function TagTypeSettingsMenu ({
  mode,
  tagType,
  close,
  onTagTypeChange
}:{
  mode: string, 
  tagType : DBTagType, 
  close:()=> void, 
  onTagTypeChange:(tagType?:DBTagType)=> void
}){
  const [headerText, setHeaderText] = useState("");
  const [confirmationButtonText, setConfirmationButtonText] = useState("");
  const [tagTypeData, setTagTypeData] = useState<DBTagType>({
    ...tagType,
    tags: tagType.tags || []
  });
  const [color, setColor] = useColor(tagType.color || "#ffffff"); // Initialize with tagType color

  useEffect(() => {
    if (mode === "create") {
      setHeaderText("CREATE TAG TYPE");
      setConfirmationButtonText("Create New Tag Type");
    } else if (mode === "edit") {
      setHeaderText("EDIT TAG TYPE");
      setConfirmationButtonText("Apply Changes");
    }
  }, [mode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const includeQuery = {
      
    }
    //Logic to create/update playlist goes here
    
    
    onTagTypeChange(tagType);
    
    
    close(); // Close modal after applying
  };

  const handleDelete = async (event) =>{
    const deletedTagType = await deleteTagType(tagType.id);
    console.log("Deleted TagType: ",deletedTagType)
    onTagTypeChange();
    close();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTagTypeData({
      ...tagTypeData,
      [name]: value
    });
  };

  const handleColorChange = (newColor: IColor) => {
    setColor(newColor); // Update the color state used by the ColorPicker
    setTagTypeData({
      ...tagTypeData,
      color: newColor.hex // Update the tagTypeData color to the hex value
    });
  };

  const emptyTag = {
    id:-1,
    name:"",
    color: tagTypeData.color,
    typeId: tagTypeData.id,
    typeName: tagTypeData.name
  }

  const handleTagChange = ()=>{

  }
  return (
    <form 
    className="flex flex-col w-[300px] h-[400px] bg-slate-600 border-4 border-white"
    onSubmit={handleSubmit}>
      <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">{headerText}</div>
        {mode === "edit"?
          (<DeleteButton handleDelete={handleDelete}/>)
          :null}
      </div>
      <div className="flex flex-col h-12 items-start justify-start text-white px-1">
        Name
        <textarea
            className="w-full h-full pl-1 text-black text-start align-top resize-none"
            name="name"
            placeholder="Type Name..."
            value={tagTypeData.name}
            onChange={handleInputChange}
        />

        
      </div>
      <div className="flex flex-row h-6 items-center gap-3 justify-start mt-3 text-white px-1">
      COLOR
        <Popup 
          trigger={<div className=" border-slate-200 border-2 w-11/12 h-full  cursor-pointer" style={{ backgroundColor: color.hex }} />}
          nested
          modal
        >
          <ColorPicker
            height={228}
            color={color}           // Use the color state from useColor
            onChange={handleColorChange}  // Update the color on change
          />
        </Popup>
      </div>
      
      {/*Add here the tags creation/visualizer window */}
      <div className="flex flex-col flex-grow mt-3">
        <div className="flex flex-row w-full text-white justify-between pl-1 pr-3">
          TAGS
          <Popup
            trigger={
              <button type="button" className="flex h-full ml-2 rounded-sm items-center justify-center w-1/3 bg-amber-300" >ADD TAG</button>
            }
            
            modal
            nested
            contentStyle={{
              marginLeft: '285px',
              marginTop:'55px'
            }}
          >
            {(close:any)=>(
              <TagSettingsMenu mode={"create"} tag={emptyTag} close = {close} onTagChange={handleTagChange}/>
            )}
            
          </Popup>
        </div>
        <div className="flex flex-grow bg-slate-200 m-1"></div>

      </div>
      <Button type='submit'>{confirmationButtonText}</Button>
    </form>
  )
}
