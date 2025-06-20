'use client';

import { useEffect, useState } from "react";
import { DBTag, DBTagType } from "../../../lib/models";
import DeleteButton from "../../Utils/deleteButton";
import { deleteTag, deleteTagType, updateTags } from "../../../lib/actions";
import { ColorPicker, useColor, IColor } from "react-color-palette";
import "react-color-palette/css";
import Popup from "reactjs-popup";
import { Button } from "../../Utils/button";

export default function TagSettingsMenu ({
  mode,
  tag,
  close,
  onTagChange
}:{
  mode: string, 
  tag : DBTag, 
  close:()=> void, 
  onTagChange:(tag:DBTag, action:'add'|'update'|'delete')=> void
}){
  const [headerText, setHeaderText] = useState("");
  const [confirmationButtonText, setConfirmationButtonText] = useState("");
  const [tagData, setTagData] = useState<DBTag>(tag);

  useEffect(() => {
    if (mode === "create") {
      setHeaderText("CREATE TAG");
      setConfirmationButtonText("Create New Tag");
    } else if (mode === "edit") {
      setHeaderText("EDIT TAG");
      setConfirmationButtonText("Apply Changes");
    }
  }, [mode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    
    if (mode === "edit") {
      const [updated] = await updateTags([tagData]);
      onTagChange(updated, "update");
    } else {
      // just update locally; the parent will create everything in createTagType()
      onTagChange(tagData, "add");
    }
    
    
    close(); // Close modal after applying
  };

  const handleDelete = async (event: React.MouseEvent) =>{
    event.preventDefault()
    event.stopPropagation()
    onTagChange(tag, 'delete')
    close();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTagData({
      ...tagData,
      [name]: value
    });
  };

  

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
            placeholder="Tag Name..."
            value={tagData.name}
            onChange={handleInputChange}
        />

        
      </div>
     
      
      {/*Add here the tag reassign selection dropdown */}
      <div className="flex flex-col flex-grow mt-3 text-white">
        {/* Reassign Tag to Type 
        <select>

        </select> */}

      </div>
      <Button type='submit'>{confirmationButtonText}</Button>
    </form>
  )
}
