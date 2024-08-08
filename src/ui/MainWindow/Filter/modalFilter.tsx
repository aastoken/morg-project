import { useState } from "react";
import { Button } from "../../button";
import FilterRow, { AddCondition } from "./filterRow";

let idCounter = 0;
  const generateId = () => {
    const returnedId = idCounter;
    console.log("Current counter:",idCounter);
    idCounter++;
    return returnedId;
  }

export default function ModalFilter(){

  
  const [filterRows, setFilterRows] = useState<JSX.Element[]>([]);

  const addFilterRow = () => {
    const id = generateId();
    setFilterRows([...filterRows,  <FilterRow key={id} deleteRow={() => deleteFilterRow(id)}/>]);
  };

  const deleteFilterRow = (id: number) => {
    console.log("Deleting row with id",id);
    setFilterRows((prevRows) => prevRows.filter(row => Number(row.key) != id));
  };

  // const form = document.querySelector('filterForm'); 
     
  // form.addEventListener('submit', function(event) { 
  //   event.preventDefault(); 
  //   // Your form submission logic here 
  // }); 

  return(
    <form id='filterForm' className="flex flex-col fixed w-1/2 h-1/2 top-1/4 left-1/4 bg-slate-700 border-4 border-slate-700 rounded-sm">
        <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">ADVANCED FILTER OPTIONS</div>
        <div className="flex items-center h-full gap-2 pl-2 bg-amber-300">
          FULFILL
          <select name="ConditionLogic" className="flex h-full pl-2 bg-amber-100">
            <option value="AND">
              ALL CONDITIONS
            </option>
            <option value="OR">
              SOME CONDITIONS
            </option>
          </select>
        </div>
        </div>
        <span className="flex flex-grow flex-col gap-3 m-3 mt-6 bg-slate-500 bg-gradient-to-b p-4 overflow-y-auto">
          {filterRows}
          <AddCondition onClick={addFilterRow}/>
        </span>
        <Button type="submit">Apply Filter</Button>
    </form>
  );
}