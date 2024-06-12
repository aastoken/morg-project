'use client';
import { Resizable } from "react-resizable";
import { useColumns } from "lib/hooks";
import { Column } from "lib/models/Column";

export default function ExplorerTable({cols, data}){
  const{
    columns,
    handleResize,
    getColumnWidth,
  } = useColumns(cols, 250);

  const rows = data;

  return (
    <div className="p-4">
      <h1>React Resizable</h1>

      <table>
        <thead className='text-left text-black'>
          <tr>
            {columns.map(({name, displayName}: Column) => <Resizable
              key={name}
              width={getColumnWidth(name)}
              height={0}
              handle={<span className="absolute right-0 top-0 z-50 h-full w-2 cursor-col-resize bg-gray-600" />}
              onResize={(_, {size: {width} }) => handleResize(name,width)}
              draggableOpts={{enableUserSelectHack: false}}>
              <th className='relative overflow-hidden whitespace-nowrap border bg-white px-6 py-1.5 text-clip'
                style={{width: getColumnWidth(name),}}
                >
                {displayName}
              </th>
              </Resizable>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) =>(
            <tr key ={index} className='bg-gray-300'>
              {columns.map((column, colIndex) =>(
                <td key = {colIndex}>{row[column.name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}