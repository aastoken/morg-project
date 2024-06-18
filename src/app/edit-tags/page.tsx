import LoadButton from '../../ui/Interactive/loadButton';
import RootFolderForm from '../../ui/Interactive/rootFolderForm';
import MenuSelector from '../../ui/MainComponents/menuSelector';
import ColorPickerWrapper from '../../ui/Graphic/colorPicker';

export default function Page(){

  return(
    <div className='flex flex-col items-start max-w-full w-full'>
      <div className="w-1/6 flex flex-row items-center justify-around gap-x-2 py-1 pr-1 bg-zinc-300 h-14">
        <MenuSelector />
      </div>

      <ColorPickerWrapper/>
    </div>
  );
}