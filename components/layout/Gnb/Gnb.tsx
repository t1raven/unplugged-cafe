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
      setTimeout(() => { moveBackground(true); }, 250);
    });
  }, [pathname]);

  /*useEffect(() => {
    const handleResize = () => { moveBackground(false); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);*/

  const lastWidth = useRef(0);

  useEffect(() => { 
    requestAnimationFrame(() => { 
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
  }, []);
  
  useEffect(() => {
    if (!gnbRef.current) return;

    const observer = new ResizeObserver(() => {
      moveBackground(false);
    });

    observer.observe(gnbRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div id="site-gnb">
      <nav ref={gnbRef}>
        <ul>
          <li className={pathname === '/' ? "active" : ""}><Link href="/" title="홈"><span className="material-symbols-rounded" translate="no">home</span></Link></li>
          <li className={pathname.startsWith('/performances') ? "active" : ""}><Link href="/performances" title="공연일정"><span className="material-symbols-rounded" translate="no">confirmation_number</span></Link></li>
          <li className={pathname.startsWith('/menu') ? "active" : ""}><Link href="/menu" title="카페메뉴"><span className="material-symbols-rounded" translate="no">local_cafe</span></Link></li>
          <li className={pathname.startsWith('/gallery') ? "active" : ""}><Link href="/gallery" title="갤러리"><span className="material-symbols-rounded" translate="no">imagesmode</span></Link></li>
          <li className={pathname.startsWith('/rental') ? "active" : ""}><Link href="/rental" title="대관신청"><span className="material-symbols-rounded" translate="no">app_registration</span></Link></li>
          {/*<li className={pathname.startsWith('/news') ? "active" : ""}><Link href="/news" className="char-text">소식</Link></li>*/}
        </ul>
        <div className="move-bg" ref={moveBgRef}></div>
      </nav>
    </div>
  );
}