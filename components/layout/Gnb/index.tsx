'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import gsap from 'gsap';

import './style.scss'

export default function Gnb() {

  const pathname = usePathname();

  const gnbRef = useRef<HTMLElement>(null);
  const moveBgRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(0);

  const moveBackground = (animate = true) => {
    if (!gnbRef.current || !moveBgRef.current) return;

    const activeMenu = gnbRef.current.querySelector(
      'li.active'
    ) as HTMLElement | null;

    if (!activeMenu) return;

    const html = document.documentElement;
    const scale = html.classList.contains('scrollDown') ? 0.85 : 1;

    const navRect = gnbRef.current.getBoundingClientRect();
    const menuRect = activeMenu.getBoundingClientRect();

    const x = (menuRect.left - navRect.left) / scale;
    const width = menuRect.width / scale;

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

      lastWidth.current = window.innerWidth;

      const handleResize = () => {
        if (window.innerWidth === lastWidth.current) {
          return;
        }

        lastWidth.current = window.innerWidth;

        moveBackground(false);

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      };
    }); 

    if (!gnbRef.current) return;

    const observer = new ResizeObserver(() => {
      moveBackground(false);
    });

    observer.observe(gnbRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      moveBackground(true);
      setTimeout(() => { moveBackground(true); }, 250);
    });
  }, [pathname]);

  /*useEffect(() => {
    const handleResize = () => { moveBackground(false); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);*/

  return (
    <div id="site-gnb">
      <nav ref={gnbRef}>
        <ul>
          <li className={pathname === '/' ? "active" : ""}><Link href="/" title="홈"><span className="material-symbols-rounded" translate="no">home</span></Link></li>
          <li className={pathname.startsWith('/performances') ? "active" : ""}><Link href="/performances" title="공연예매"><span className="material-symbols-rounded" translate="no">confirmation_number</span></Link></li>
          <li className={pathname.startsWith('/menu') ? "active" : ""}><Link href="/menu" title="카페"><span className="material-symbols-rounded" translate="no">local_cafe</span></Link></li>
          <li className={pathname.startsWith('/gallery') ? "active" : ""}><Link href="/gallery" title="기록"><span className="material-symbols-rounded" translate="no">photo</span></Link></li>
          <li className={pathname.startsWith('/rental') ? "active" : ""}><Link href="/rental" title="대관안내"><span className="material-symbols-rounded" translate="no">music_note_add</span></Link></li>
          {/*<li className={pathname.startsWith('/news') ? "active" : ""}><Link href="/news" title="소식"><span className="material-symbols-rounded" translate="no">brand_awareness</span></Link></li>*/}
        </ul>
        <div className="move-bg" ref={moveBgRef}></div>
      </nav>
    </div>
  );
}