'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useParams, useRouter } from "next/navigation";
import { getDeviceType, DeviceType } from "@/utils/device";
import Link from 'next/link';
import gsap from 'gsap';

import './style.scss'

export default function Gnb() {

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const gnbRef = useRef<HTMLElement>(null);
  const moveBgRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(0);

  const [device, setDevice] = useState<DeviceType>("desktop");

  const moveBackground = (animate = true) => {
    if (!gnbRef.current || !moveBgRef.current) return;

    const activeMenu = gnbRef.current.querySelector(
      'li.active'
    ) as HTMLElement | null;

    if (!activeMenu) return;

    const html = document.documentElement;
    let scale = html.classList.contains('scrollDown') ? 0.85 : 1;

    if(device === "desktop") scale = 1;

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
        setDevice(getDeviceType());

        if (window.innerWidth === lastWidth.current) {
          return;
        }

        lastWidth.current = window.innerWidth;

        moveBackground(false);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
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
    setDevice(getDeviceType());
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
    (!params.slug || device == "desktop") && (
      <div id="site-gnb">
        <nav ref={gnbRef}>
          <ul>
            <li className={pathname === '/' ? "active" : ""}><Link href="/" title="홈"><span className="icon material-symbols-rounded" translate="no">home</span><span className="text">홈</span></Link></li>
            <li className={pathname.startsWith('/performances') ? "active" : ""}><Link href="/performances" title="공연예매"><span className="icon material-symbols-rounded" translate="no">confirmation_number</span><span className="text">공연예매</span></Link></li>
            <li className={pathname.startsWith('/cafe') ? "active" : ""}><Link href="/cafe" title="카페"><span className="icon material-symbols-rounded" translate="no">local_cafe</span><span className="text">카페</span></Link></li>
            <li className={pathname.startsWith('/archives') ? "active" : ""}><Link href="/archives" title="기록"><span className="icon material-symbols-rounded" translate="no">photo</span><span className="text">기록</span></Link></li>
            <li className={pathname.startsWith('/rental') ? "active" : ""}><Link href="/rental" title="대관안내"><span className="icon material-symbols-rounded" translate="no">developer_guide</span><span className="text">대관안내</span></Link></li>
          </ul>
          <div className="move-bg" ref={moveBgRef}></div>
        </nav>
      </div>
    )
  );
}