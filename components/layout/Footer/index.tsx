"use client";

import type { MouseEvent } from 'react';

import './style.scss'

export default function Footer() {
  return (
    <footer id="site-footer">
      <div className="inner">
        <div>
          <div className="footer-info">
            <ul>
              <li><b>주소</b>  서울 마포구 와우산로29길 15 2층 201호</li>
              <li><b>전화번호</b>  070-7517-3004</li>
              <li><b>영업시간</b>  12:00 ~ 24:00 (23:00 라스트 오더)</li>
            </ul>
          </div>
          <div className="footer-copy">Unplugged Lounge © 2026</div>
        </div>
      </div>
    </footer>
  );
}