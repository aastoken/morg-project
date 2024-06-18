import Explorer from '../ui/MainComponents/explorer';
import TrackDetailsWindow from '../ui/MainComponents/trackDetailsWindow';
import SidePanel from '../ui/MainComponents/sidePanel';

export const dynamic = 'force-dynamic'
export default function Home() {
  

  return (
    <>
      <SidePanel/>
      
      <div className="flex flex-col h-full overflow-hidden">

      
        <div className="flex-none w-full h-[45%] bg-zinc-300 border-l-2 border-amber-300">
          <TrackDetailsWindow/>
        </div>

        <div className="flex-grow overflow-hidden">
      
          <Explorer/>

        </div>
      </div>
      
    </>
   
  );
}
