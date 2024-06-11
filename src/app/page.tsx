import Image from "next/image";
import Explorer from './ui/explorer';
import LoadButton from "ui/loadButton";

export const dynamic = 'force-dynamic'
export default function Home() {
  

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-24">
      <LoadButton/>
      <div className="z-10 w-full max-w-5xl items-left justify-between font-mono text-sm lg:flex">
        <Explorer/>
        
      </div>
      
      
    </main>
  );
}
