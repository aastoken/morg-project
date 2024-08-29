import { useState } from "react";
import { Button } from "../../button";
import { trackKeys } from '../../../lib/models/Track';
import FilterRow, { AddCondition } from "./filterRow";
import { Genre, Tag } from "../../../lib/models";
import {buildAdvancedQuery} from "../../../lib/scripts/toolbox"

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



  export default function ModalFilter({
    setAdvancedFilter,
    filterRowsData,
    setFilterRowsData,
    allConditions,
    setAllConditions,
    close
  }) {
    const handleConditionalChange = (event) => {
      const { value } = event.target;
      setAllConditions(value === "AND");
    };
  
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
  
    const deleteFilterRow = (id) => {
      setFilterRowsData((prevRowsData) =>
        prevRowsData.filter((rowData) => rowData.id !== id)
      );
    };
  
    const updateFilterRow = (id, updatedRowData) => {
      setFilterRowsData((prevRowsData) =>
        prevRowsData.map((rowData) =>
          rowData.id === id ? { ...rowData, ...updatedRowData } : rowData
        )
      );
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("Filter data:", filterRowsData);
      console.log("ALL Conditions:", allConditions);
      const explorerQuery = buildAdvancedQuery(filterRowsData, allConditions)
      console.log("AdvancedFilter:",explorerQuery)
      setAdvancedFilter(explorerQuery);
      close(); // Close modal after applying the filter
    };
  
    return (
      <form
        id="filterForm"
        className="flex flex-col fixed w-1/2 h-1/2 top-1/4 left-1/4 bg-slate-700 border-4 border-slate-700 rounded-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
          <div className="text-xl p-2">ADVANCED FILTER OPTIONS</div>
          <div className="flex items-center h-full gap-2 pl-2 bg-amber-300">
            FULFILL
            <select
              name="ConditionLogic"
              className="flex h-full pl-2 bg-amber-100"
              onChange={handleConditionalChange}
              value={allConditions ? "AND" : "OR"}
            >
              <option value="AND">ALL CONDITIONS</option>
              <option value="OR">SOME CONDITIONS</option>
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
          <AddCondition onClick={addFilterRow} />
        </span>
        <Button type="submit">Apply Filter</Button>
      </form>
    );
  }