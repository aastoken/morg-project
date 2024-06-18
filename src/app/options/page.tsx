import LoadButton from '../../ui/Interactive/loadButton';
import RootFolderForm from '../../ui/Interactive/rootFolderForm';
import MenuSelector from '../../ui/MainComponents/menuSelector';


export default function Page(){

  return(
    <div className='flex flex-col items-start max-w-full w-full'>
      <div className="w-1/6 flex flex-row items-center justify-around gap-x-2 py-1 pr-1 bg-zinc-300 h-14">
        <MenuSelector />
      </div>
    <div className='flex flex-col m-10 max-h-full h-fit gap-8 justify-start'>
      <div className='text-9xl text h-fit'>
        OPTIONS
      </div>
      <RootFolderForm/>
      <LoadButton/>
    </div>
  </div>
  );
}