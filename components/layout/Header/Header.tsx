'use client';

import { useEffect } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';

import './Header.scss'


export default function Header() {

  const pathname = usePathname();

  useEffect(() => {
    
  }, []);

  return (
    <header id="site-header">
      <div className="inner">
        <div className="logo">
          <Link href="/">UNPLUGGED</Link>
        </div>
        <div className="menu">
          <ul>
            <li className={pathname === "/menu" ? "active" : ""}><Link href="/menu" className="char-text">메뉴</Link></li>
            <li className={pathname === "/performances" ? "active" : ""}><Link href="/performances" className="char-text">공연</Link></li>
            <li className={pathname === "/rental" ? "active" : ""}><Link href="/rental" className="char-text">대관</Link></li>
            <li className={pathname === "/gallery" ? "active" : ""}><Link href="/gallery" className="char-text">갤러리</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}