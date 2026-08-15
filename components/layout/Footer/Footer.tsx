"use client";

import type { MouseEvent } from 'react';

import './Footer.scss'

export default function Footer() {

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.currentTarget.parentElement?.classList.toggle('on');
  };

  return (
    <footer id="site-footer">
      <div className="inner">
        <div className="footer-logo">
          {/*<img src="/assets/img/common/site_logo_wh.png" />*/}
          UNPLUGGED LOUNGE
        </div>
        <div>
          <div className="footer-info">
            <ul>
              <li><b>주소</b>  서울 마포구 와우산로29길 15 2층 201호</li>
              <li><b>전화번호</b>  070-7517-3004</li>
              <li><b>영업시간</b>  12:00 ~ 24:00 (23:00 라스트 오더)</li>
            </ul>
          </div>
          <div className="footer-copy">Copyright 2008 © Unplugged Lounge. All rights reserved.</div>
        </div>
        <div className="footer-link">
          <div className="sns_link">
            <ul>
              <li>
                <a href="https://www.instagram.com/unplugged.lounge/" target="_blank"><img src="/images/common/footer_sns_link_insta.png" /></a>
              </li>
            </ul>
          </div>
          <div className="group_link drop-box">
            <a href="#" onClick={ handleClick }>관련사</a>
            <ul className="list" data-lenis-prevent-wheel="">
              <li>
                <ul className="sub-menu">
                  <li><a href="#" title="새창열림" target="_blank">홍대점</a></li>
                  <li><a href="#" title="새창열림" target="_blank">서교음악다방</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}