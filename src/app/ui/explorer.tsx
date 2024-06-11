import ExplorerTable from "./explorerTable";


export default function Explorer(){
  const columns = [
    {
      name: 'col1',
      displayName: 'Column 1',
      width: 150
    },
    {
      name: 'col2',
      displayName: 'Column 2',
      width: 200  
    },
    {
      name: 'col3',
      displayName: 'Column 3',
      width: 350
    }
  ];
  const data = [
    { col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' },
    { col1: 'Data 4', col2: 'Data 5', col3: 'Data 6' },
    { col1: 'Data 7', col2: 'Data 8', col3: 'Data 9' },
  ];

  return(
    <div className="bg-accent min-w-5 resize-x">
      <ExplorerTable cols ={columns} data={data} />
    </div>
  );
}