'use client';
import { Resizable } from "react-resizable";
import { useColumns } from "lib/hooks";
import { Column } from "lib/models/Column";
import { Track } from "lib/models";
import { useEffect, useState } from "react";
import { getAllTracks } from "lib/actions";
import { initcolumns } from "lib/models/columns";
import "react-resizable/css/styles.css";

export default function ExplorerTable(){
  
  const tracks: Track[] = []
  const initcols: Column[] = initcolumns;
  
  const [data, setData] = useState(tracks);
  const{
    columns,
    handleResize,
    getColumnWidth,
  } = useColumns(initcols, 250);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getAllTracks();
        console.log("Result:",result)
        if(result.length >0){
          // const resultCols = Object.keys(result[0]).map(key=>({name: key, displayName: key, width: 200}))
          // console.log("Result Columns:",resultCols)

          setData(result);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  let rows = data;

  return (
    <div className='p-1 overflow-y-scroll h-full shadow-lg'>
      <table className="min-w-full w-full ">
        <thead className='text-left text-black  sticky -top-3 z-1'>
          <tr>
            {columns.map(({name, displayName}: Column) => <Resizable
              key={name}
              width={getColumnWidth(name)}
              height={0}
              handle={<span className="absolute  -right-1 top-0 z-50 h-full w-2 cursor-col-resize bg-transparent" />}
              onResize={(_, {size: {width} }) => handleResize(name,width)}
              draggableOpts={{enableUserSelectHack: false}}>
              <th className='relative overflow-visible whitespace-nowrap h-5 border-2 border-solid border-white bg-fuchsia-500 px-6 py-1.5 text-clip'
                style={{width: getColumnWidth(name),}}
                >
                {displayName}
              </th>
              </Resizable>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) =>(
            <tr key ={index} className='border-gray-500 border-b-2 bg-slate-800 text-white  z-2 '>
              {columns.map((column, colIndex) =>{
                const cellValue = row[column.name];
                return(
                  <td
                  key={colIndex}
                  className='border-spacing-x-0.5 h-16 p-2 overflow-hidden'
                  
                >
                    <div className='h-full overflow-y-auto overflow-x-hidden'>
                      {typeof cellValue === 'object' ? JSON.stringify(cellValue) : cellValue}
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