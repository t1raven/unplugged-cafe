'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import gsap from 'gsap';

import './Gnb.scss'

export default function Gnb() {

  const pathname = usePathname();

  const gnbRef = useRef<HTMLElement>(null);
  const moveBgRef = useRef<HTMLDivElement>(null);

  const moveBackground = (animate = true) => {
    if (!gnbRef.current || !moveBgRef.current) return;

    const activeMenu = gnbRef.current.querySelector(
      'li.active'
    ) as HTMLElement | null;

    if (!activeMenu) return;

    const navRect = gnbRef.current.getBoundingClientRect();
    const menuRect = activeMenu.getBoundingClientRect();

    const x = menuRect.left - navRect.left;
    const width = menuRect.width;

    if (animate) { 
      gsap.to(moveBgRef.current, { 
        x, 
        y: "-50%",
        width, 
        duration: 0.45, 
        ease: 'power3.out', 
      }); 
    } else { 
      gsap.set(moveBgRef.current, { 
        x, 
        y: "-50%",
        width, 
      }); 
    }
  };

  useEffect(() => { 
    requestAnimationFrame(() => { 
      moveBackground(false); 
    }); 
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      moveBackground(true);
    });
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => { moveBackground(false); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <nav id="site-gnb" ref={gnbRef}>
      <ul>
        <li className={pathname === '/' ? "active" : ""}><Link href="/" className="char-text">홈</Link></li>
        <li className={pathname.startsWith('/performances') ? "active" : ""}><Link href="/performances" className="char-text">공연</Link></li>
        <li className={pathname.startsWith('/menu') ? "active" : ""}><Link href="/menu" className="char-text">메뉴</Link></li>
        <li className={pathname.startsWith('/gallery') ? "active" : ""}><Link href="/gallery" className="char-text">갤러리</Link></li>
        <li className={pathname.startsWith('/rental') ? "active" : ""}><Link href="/rental" className="char-text">대관</Link></li>
        {/*<li className={pathname.startsWith('/news') ? "active" : ""}><Link href="/news" className="char-text">소식</Link></li>*/}
      </ul>
      <div className="move-bg" ref={moveBgRef}></div>
    </nav>
  );
}