'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import gsap from 'gsap';

import './Header.scss'

export default function Header() {
  return (
    <header id="site-header">
      <div className="inner">
        <div className="gnb-btn"></div>
        <div className="logo">
          <Link href="/">UNPLUGGED LOUNGE</Link>
        </div>
        {/*<nav className="gnb" ref={gnbRef}>
          <ul>
            <li className={pathname === '/' ? "active" : ""}><Link href="/" className="char-text">홈</Link></li>
            <li className={pathname.startsWith('/performances') ? "active" : ""}><Link href="/performances" className="char-text">공연</Link></li>
            <li className={pathname.startsWith('/menu') ? "active" : ""}><Link href="/menu" className="char-text">메뉴</Link></li>
            <li className={pathname.startsWith('/gallery') ? "active" : ""}><Link href="/gallery" className="char-text">갤러리</Link></li>
            <li className={pathname.startsWith('/rental') ? "active" : ""}><Link href="/rental" className="char-text">대관</Link></li>
            <li className={pathname.startsWith('/news') ? "active" : ""}><Link href="/news" className="char-text">소식</Link></li>
          </ul>
          <div className="move-bg" ref={moveBgRef}></div>
        </nav>*/}
        <div className="gnb-btn"></div>
      </div>
    </header>
  );
}