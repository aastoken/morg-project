'use client';

import { DBTagType } from "../../../lib/models";

export default function TagSettingsMenu ({
  mode,
  tagType,
  close,
  onTagTypeChange
}:{
  mode: string, 
  tagType : DBTagType|undefined, 
  close:()=> void, 
  onTagTypeChange:(tagType?:DBTagType)=> void
}){

  return (
    <div className="flex w-96 h-[415px] bg-red-500"></div>
  )
}
