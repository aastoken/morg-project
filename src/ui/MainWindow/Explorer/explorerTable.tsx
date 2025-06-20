'use client';
import { Resizable } from "react-resizable";
import { useColumns } from "../../../lib/hooks";
import { Column } from "../../../lib/models/Column";
import { DBTrack, Track } from "../../../lib/models";
import { useEffect, useState } from "react";
import { getAllTracks, getFilteredDBTracks, getFilteredTracks } from "../../../lib/actions";
import { initcolumns } from "../../../lib/models/columns";
import "react-resizable/css/styles.css";
import { Cabin } from "next/font/google";
import GenresVisualizer from "../GenreBrowser/genresVisualizer";
import TagTypesVisualizer from "../TagBrowser/tagTypesVisualizer";
import { getTagTypesFromTagArray } from "../../../lib/scripts/toolbox";
import { formatDateTime, millisToMinutes } from "../../../lib/scripts";

const cabin = Cabin({ subsets: ["latin"] });


export default function ExplorerTable({explorerQuery, onTrackSelect}:{explorerQuery, onTrackSelect : (track:DBTrack)=> void}){
  
  const tracks: DBTrack[] = []
  const initcols: Column[] = initcolumns;
  
  const [data, setData] = useState(tracks);
  const{
    columns,
    handleResize,
    getColumnWidth,
  } = useColumns(initcols, 250);
  const getData = async () => {
      try {
        const result = await getFilteredDBTracks(explorerQuery); //await getAllTracks();
        //console.log("Result:",result)
        
        setData(result);
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  useEffect(() => {
    

    getData();
  }, [explorerQuery]);

  let rows = data;

  const renderCellValue = (columnName: string, cellValue: any) => {
    if (columnName === 'tags') {
      return <TagTypesVisualizer tag_types={getTagTypesFromTagArray(cellValue)} onTagSelect={()=>{}} />;
    } else if (columnName === 'genres') {
      return <GenresVisualizer genres={cellValue} onGenreSelect={()=>{}} />;
    } else if (columnName === 'length'){
      return millisToMinutes(cellValue)
    } else if (columnName === 'dateAdded'){
      return formatDateTime(cellValue)
    }
    else {
      return typeof cellValue === 'object' ? JSON.stringify(cellValue) : cellValue;
    }
  };

  const handleRowClick = (track: DBTrack) => {
    onTrackSelect(track);
  };

  return (
    <div className='overflow-y-scroll max-h-full h-full shadow-lg border-l-2 border-r-2 border-amber-400 custom-scrollbar bg-slate-800'>
      <table className={`min-w-full w-full table-fixed ${cabin.className} border-l-2 border-r-2 border-amber-400`}>
        <thead className='text-left text-black bg-white sticky -top-0 z-1'>
          <tr>
            {columns.map(({name, displayName}: Column) => <Resizable
              key={name}
              width={getColumnWidth(name)}
              height={0}
              handle={<span className="absolute  -right-1 top-0 z-50 h-full w-2 cursor-col-resize bg-transparent" />}
              onResize={(_, {size: {width} }) => handleResize(name,width)}
              draggableOpts={{enableUserSelectHack: false}}>
              <th className='relative overflow-visible whitespace-nowrap h-5 border-2 border-white bg-amber-300 px-6 py-1.5 text-clip'
                style={{width: getColumnWidth(name),}}
                >
                {displayName}
              </th>
              </Resizable>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) =>(
            <tr key ={index} 
                tabIndex={index} 
                className='border-gray-500 border-b-2 text-white odd:bg-slate-800 even:bg-slate-700  hover:bg-slate-500 focus:bg-amber-200 focus:text-black active:bg-orange-300 active:text-black  z-2 '
                onClick={() => handleRowClick(row)}>
              {columns.map((column, colIndex) =>{
                const cellValue = row[column.name];
                return(
                  <td
                  key={colIndex}
                  className='border-spacing-x-0.5 h-16 p-2 overflow-hidden '
                  
                >
                    <div className='flex h-full overflow-y-auto overflow-x-hidden items-center '>
                      {renderCellValue(column.name, cellValue)}
                    </div>
                  </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 