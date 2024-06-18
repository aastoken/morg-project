import { Column } from "../models/Column";
import { useState } from "react";

export const useColumns = (initialColumns: Column[], defaultWidth: number) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
   
  const handleResize = (name: string, width: number) => {
      
    const updatedColumns = [...columns];

    const foundColumnIndex = updatedColumns.findIndex(({name: columnName}) => columnName === name);

    if(foundColumnIndex === -1){
      return;
    }
    //console.log("Column Resizing to width: "+ width);
    updatedColumns[foundColumnIndex].width = Math.floor(width);
    setColumns(updatedColumns);
  }

  const getColumnWidth = (name: string): number => {
    const foundColumn = columns.find(({name: columnName}) => columnName === name);
    
    if(foundColumn){
      //console.log("Width of column:",foundColumn.width);
      return foundColumn.width
    }
    return defaultWidth;
  };

  return{ columns, handleResize, getColumnWidth}
}