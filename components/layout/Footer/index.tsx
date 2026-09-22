import './style.scss'
import { getSiteSettings } from '@/lib/siteSettings';

const settings = await getSiteSettings();

export default function Footer() {
  return (
    <footer id="site-footer">
      <div className="inner">
        <div>
          <div className="footer-title">{settings?.businessName}</div>
          <div className="footer-info">
            <ul>
              <li><b>주소</b> {settings?.address}</li>
              <li><b>전화번호</b> {settings?.phone}</li>
              <li><b>영업시간</b> {settings?.businessHours}</li>
            </ul>
          </div>
          <div className="footer-copy">© 2026 {settings?.siteName}. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
}