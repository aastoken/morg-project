import { useState } from "react";
import { Button } from "../../button";
import { trackKeys } from '../../../lib/models/Track';
import FilterRow, { AddCondition } from "./filterRow";
import { Genre, Tag } from "../../../lib/models";

let idCounter = 0;
  const generateId = () => {
    const returnedId = idCounter;
    console.log("Current counter:",idCounter);
    idCounter++;
    return returnedId;
  }

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

export default function ModalFilter(){

  const [allConditions, setAllConditions] = useState<boolean>(true);
  const [filterRowsData, setFilterRowsData] = useState<
    {
      id: number;
      selectedKey: string;
      selectedComparator: string;
      selectedTags: Tag[];
      selectedGenres: Genre[];
      inputValue: any;
      inputValueMin: any;
      inputValueMax: any;
    }[]
  >([]);

  const addFilterRow = () => {
    const id = generateId();
    setFilterRowsData([
      ...filterRowsData,
      {
        id,
        selectedKey: trackKeys[0],
        selectedComparator: stringOptions[0],
        selectedTags: [],
        selectedGenres: [],
        inputValue: "",
        inputValueMin: "",
        inputValueMax: ""
      },
    ]);
  };

  const deleteFilterRow = (id: number) => {
    setFilterRowsData((prevRowsData) =>
      prevRowsData.filter((rowData) => rowData.id !== id)
    );
  };

  const updateFilterRow = (
    id: number,
    updatedRowData: Partial<{
      selectedKey: string;
      selectedComparator: string;
      selectedTags: Tag[];
      selectedGenres: Genre[];
      inputValue: any;
      inputValueMin: any;
      inputValueMax: any;
    }>
  ) => {
    setFilterRowsData((prevRowsData) =>
      prevRowsData.map((rowData) =>
        rowData.id === id ? { ...rowData, ...updatedRowData } : rowData
      )
    );
  };

  const handleConditionalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (value == "AND"){
      setAllConditions(true)
    }
    else if (value == "OR"){
      setAllConditions(false)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Filter data:", filterRowsData);
    console.log("ALL Conditions:",allConditions)
    // Your form submission logic here
  };

  return(
    <form id='filterForm' 
    className="flex flex-col fixed w-1/2 h-1/2 top-1/4 left-1/4 bg-slate-700 border-4 border-slate-700 rounded-sm"
    onSubmit={handleSubmit}>
        <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">ADVANCED FILTER OPTIONS</div>
        <div className="flex items-center h-full gap-2 pl-2 bg-amber-300">
          FULFILL
          <select name="ConditionLogic" className="flex h-full pl-2 bg-amber-100" onChange={handleConditionalChange}>
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
          {filterRowsData.map((rowData) => (
            <FilterRow
              key={rowData.id}
              rowData={rowData}
              deleteRow={() => deleteFilterRow(rowData.id)}
              updateRow={(updatedData) => updateFilterRow(rowData.id, updatedData)}
            />
          ))}
          <AddCondition onClick={addFilterRow}/>
        </span>
        <Button type="submit">Apply Filter</Button>
    </form>
  );
}