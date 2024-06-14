import Image from "next/image";
import Explorer from './ui/explorer';
import LoadButton from "ui/loadButton";
import ExplorerTable from "ui/explorerTable";

export const dynamic = 'force-dynamic'
export default function Home() {
  

  return (
    <main className="relative flex min-h-screen flex-col items-left ">
      <LoadButton/>
      <div className="fixed top-1/2 left-0 w-full max-w-full max-h-full h-1/2">
        <Explorer/>

      </div>
      
      
    </main>
   
  );
}
