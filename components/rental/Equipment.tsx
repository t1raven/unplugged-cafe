'use client';

import { useState } from 'react';

const equipment = [
  {
    category: 'MIC',
    title: '마이크',
    items: [
      '유선 x2 (SM 58)',
      '무선 x2 (BETA 58a)',
    ],
  },
  {
    category: 'INSTRUMENT',
    title: '악기',
    items: [
      '건반 (Yamaha MX88)',
      '드럼 Pearl export 시리즈 (5기통)',
    ],
  },
  {
    category: 'AMP',
    title: '앰프',
    items: [
      '어쿠스틱 기타는 DI 연결',
      '일렉기타 앰프 x2 (Fender Blues Jr, VOX ac10c1)',
      '베이스 앰프 x1 (Fender Rumble 25)',
    ],
  },
  {
    category: 'ACCESSORY',
    title: '악세사리',
    items: [
      '케이블 (5.5잭, XLR잭 등)',
      '마이크스탠드 x6',
      '보면대 (일반 x3, 핸드폰/태블릿 거치 x2)',
      'DI (액티브 DI)',
    ],
  },
];

export default function RentalEquipment() {
  const [active, setActive] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActive((current) => (current === index ? null : index));
  };

  return (
    <div className="rental-equipment">
      {equipment.map((equipment, index) => {
        const isActive = active === index;

        return (
          <div
            key={equipment.category}
            className={`equipment-item ${
              isActive ? 'is-active' : ''
            }`}
          >
            <button
              type="button"
              className="equipment-item__header"
              onClick={() => toggle(index)}
              aria-expanded={isActive}
            >
              <span className="equipment-item__number">
                0{index + 1}
              </span>

              <span className="equipment-item__category">
                {equipment.category}
              </span>

              <strong>{equipment.title}</strong>

              <span className="equipment-item__icon">
                +
              </span>
            </button>

            <div
              className="equipment-item__content"
              style={{
                gridTemplateRows: isActive ? '1fr' : '0fr',
              }}
            >
              <div>
                <ul>
                  {equipment.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <div className="equipment-warning">
        <strong>사용 시 주의사항</strong>

        <ul>
          <li>
            공연공간 여건상 어쿠스틱 기타 마이킹은 불가합니다.
          </li>

          <li>
            개인 앰프 지참 시, 마이킹 가능 
          </li>

          <li>
            개인 마이크 지참 시 사용가능 (5개 이상 필요 시 or 본인 장비 사용 시)
          </li>

          <li>
            인어어팩 없음 (이어폰+팩 지참시 2개까지 사용가능)
          </li>
        </ul>
      </div>
    </div>
  );
}