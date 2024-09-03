import { useEffect, useState } from "react";
import { Button } from "../../button";
import { trackKeys } from '../../../lib/models/Track';
import FilterRowComponent, { AddCondition } from "./filterRow";
import { FilterData, FilterRow, Genre, Tag } from "../../../lib/models";
import {buildAdvancedQuery} from "../../../lib/scripts/toolbox"

let idCounter = 0;
  const generateId = () => {
    const returnedId = idCounter;
    //console.log("Current counter:",idCounter);
    idCounter++;
    return returnedId;
  }

const stringOptions = ['contains','not contains','equals','not equals']//TO DO: Quitar duplicado



  export default function ModalFilter({
    type,
    filterData,
    setFilterData,
    onApplyFilter,
    close
  }: {
    type: string,
    filterData: FilterData;
    setFilterData: (data: FilterData) => void;
    onApplyFilter: (appliedFilterData: FilterData) => void; //Callback to parent with the state of the filter when the form is submitted
    close: () => void;
  }) {

    const [headerText, setHeaderText] = useState("");
    const [confirmationButtonText, setConfirmationButtonText] = useState("");

    useEffect(() => {
      if (type === "filter") {
        setHeaderText("ADVANCED FILTER OPTIONS");
        setConfirmationButtonText("Apply Filter");
      } else if (type === "rules") {
        setHeaderText("AUTOMATIC PLAYLIST RULES");
        setConfirmationButtonText("Apply Rules");
      }
    }, [type]);

    const handleConditionalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterData({ ...filterData, allConditions: event.target.value === "AND" });
    };
  
    const addFilterRow = () => {
      const id = generateId();
      const newRow : FilterRow = {
          id,
          selectedKey: trackKeys[0],
          selectedComparator: stringOptions[0],
          selectedTags: [],
          selectedGenres: [],
          inputValue: "",
          inputValueMin: "",
          inputValueMax: ""
      }
      setFilterData({
        ...filterData,
        filterRows: [...filterData.filterRows, newRow],
      });
    };
  
    const deleteFilterRow = (id) => {
      setFilterData({
        ...filterData,
        filterRows: filterData.filterRows.filter((row) => row.id !== id),
      });
    };
  
    const updateFilterRow = (id, updatedRowData: Partial<FilterRow>) => {
      setFilterData({
        ...filterData,
        filterRows: filterData.filterRows.map((row) =>
          row.id === id ? { ...row, ...updatedRowData } : row
        ),
      });
    };
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      console.log("Filter data:", filterData.filterRows);
      console.log("ALL Conditions:", filterData.allConditions);
      onApplyFilter(filterData);
      close(); // Close modal after applying the filter
    };
  
    return (
      <form
        id="filterForm"
        className="flex flex-col fixed w-1/2 h-1/2 top-1/4 left-1/4 bg-slate-700 border-4 border-slate-700 rounded-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
          <div className="text-xl p-2">{headerText}</div>
          <div className="flex items-center h-full gap-2 pl-2 bg-amber-300">
            FULFILL
            <select
              name="ConditionLogic"
              className="flex h-full pl-2 bg-amber-100"
              onChange={handleConditionalChange}
              value={filterData.allConditions ? "AND" : "OR"}
            >
              <option value="AND">ALL CONDITIONS</option>
              <option value="OR">SOME CONDITIONS</option>
            </select>
          </div>
        </div>
        <span className="flex flex-grow flex-col gap-3 m-3 mt-6 bg-slate-500 bg-gradient-to-b p-4 overflow-y-auto">
          {filterData.filterRows.map((rowData) => (
            <FilterRowComponent
              key={rowData.id}
              rowData={rowData}
              deleteRow={() => deleteFilterRow(rowData.id)}
              updateRow={(updatedData) => updateFilterRow(rowData.id, updatedData)}
            />
          ))}
          <AddCondition onClick={addFilterRow} />
        </span>
        <Button type="submit">{confirmationButtonText}</Button>
      </form>
    );
  }