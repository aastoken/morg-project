import Image from 'next/image';
import Link from 'next/link';

export default function MorgLogo(){

  return(
    <Link className='min-w-32 w-32'
    href="/">
      <Image 
      src='/Logo.png'
      width={963}
      height={449}
      alt="Morg Logo"
      />
    </Link>
  );
}