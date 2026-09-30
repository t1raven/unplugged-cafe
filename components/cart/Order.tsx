'use client';

import {
  FormEvent,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import { useDaumPostcode } from '@/hooks/useDaumPostcode';

import type { CartItem } from '@/hooks/cartStore';

import { TextField, TextareaField } from '@/components/common/Input/TextField';
import { formatPhone } from "@/utils/formatPhone";

import type { OrderSettings } from '@/types/siteSettings';

interface Props {
  items: CartItem[];

  orderSettings: OrderSettings;

  totalPrice: number;

  closeCart: () => void;

  onBack: () => void;

  onComplete: (
    orderNumber: string
  ) => void;
}

type DeliveryMethod =
  | 'delivery'
  | 'pickup';

export default function Order({
  orderSettings,
  items,
  totalPrice,
  onBack,
  closeCart,
  onComplete,
}: Props) {
  const [
    deliveryMethod,
    setDeliveryMethod,
  ] =
    useState<DeliveryMethod>(
      'delivery'
    );

  const [name, setName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [postcode, setPostcode] =
    useState('');

  const [address, setAddress] =
    useState('');

  const [
    detailAddress,
    setDetailAddress,
  ] = useState('');

  const [memo, setMemo] =
    useState('');

  const [privacyAgreed, setPrivacyAgreed] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    if (!privacyAgreed) {
      setError(
        '개인정보 수집·이용에 동의해주세요.'
      );

      return;
    }

    if (
      deliveryMethod ===
        'delivery' &&
      (!postcode ||
        !address ||
        !detailAddress)
    ) {
      setError(
        '배송 주소를 입력해주세요.'
      );

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch('/api/order', {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            deliveryMethod,

            customer: {
              name,
              phone,

              address:
                deliveryMethod ===
                'delivery'
                  ? {
                      postcode,
                      address,
                      detailAddress,
                    }
                  : null,
            },

            memo,

            privacyAgreed,

            items: items.map(
              (item) => ({
                goodsId:
                  item.goodsId,

                quantity:
                  item.quantity,

                options:
                  item.options,
              })
            ),
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            '구매 신청에 실패했습니다.'
        );
      }

      onComplete(
        data.orderNumber
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '구매 신청에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };


  // Seearch Address
  const detailAddressRef =
    useRef<HTMLInputElement>(null);

  const {
    openPostcode,
  } = useDaumPostcode({
    onComplete: ({
      postcode,
      address,
    }) => {
      setPostcode(postcode);
      setAddress(address);

      requestAnimationFrame(() => {
        detailAddressRef.current?.focus();
      });
    },
  });

  const handleAddressSearch =
    async () => {
      try {
        setError(null);

        await openPostcode();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '주소 검색을 실행할 수 없습니다.'
        );
      }
    };

  const deliveryFee =
    deliveryMethod === 'delivery'
      ? (orderSettings?.deliveryFee ?? 3000)
      : 0;

  const finalPrice =
    totalPrice +
    deliveryFee;

  const depositAccount = orderSettings?.depositAccount;

  return (
    <>
      <div className="cart-header">
        <button
          type="button"
          className="cart-back"
          onClick={onBack}
          aria-label="장바구니로 돌아가기"
        >
          <span className="material-symbols-rounded">
            arrow_back_ios
          </span>
        </button>

        <h2>주문 신청</h2>

        <button
          type="button"
          className="cart-close"
          onClick={closeCart}
          aria-label="닫기"
        >
          <span className="material-symbols-rounded">
            close
          </span>
        </button>
      </div>

      <form
        className="order-form"
        onSubmit={handleSubmit}
      >
        <div className="order-form-body">

          {/* 배송방법 */}
          <section className="order-section">
            <h3>
              배송방법
            </h3>

            <div className="delivery-methods">

              <label
                className={
                  deliveryMethod ===
                  'delivery'
                    ? 'active'
                    : ''
                }
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={
                    deliveryMethod ===
                    'delivery'
                  }
                  onChange={() =>
                    setDeliveryMethod(
                      'delivery'
                    )
                  }
                />

                <span>
                  배송
                </span>
              </label>

              <label
                className={
                  deliveryMethod ===
                  'pickup'
                    ? 'active'
                    : ''
                }
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={
                    deliveryMethod ===
                    'pickup'
                  }
                  onChange={() =>
                    setDeliveryMethod(
                      'pickup'
                    )
                  }
                />

                <span>
                  픽업
                </span>
              </label>

            </div>

            <div className="delivery-guide">
              {deliveryMethod === 'delivery' ? (
                <>
                  {/*<div className="guide-title">배송 안내</div>*/}
                  <div className="guide-content">
                    입금자와 주문자 이름이 동일하여야 하며,<br/>
                    입금 확인 후 배송이 시작됩니다.<br/>
                    입금 계좌: <strong>{depositAccount}</strong><br/>
                  </div>
                </>
              ) : (
                <>
                  {/*<div className="guide-title">픽업 안내</div>*/}
                  <div className="guide-content">
                    아래 주소로 픽업하러 와주세요.<br/>
                    <strong>서울 마포구 와우산로29길 15 2층서울 마포구 서교동 336-5 2층</strong><br/>
                    영업시간: 12:00 - 24:00
                  </div>
                </>
              )}
            </div>
              
          </section>

          {/* 주문내역 */}
          <section className="order-section order-products">

            <h3>
              주문 내역
            </h3>

            {items.map((item) => (
              <div
                key={item.cartId}
                className="order-product"
              >
                <div className="order-product-image">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                    />
                  )}
                </div>

                <div className="order-product-info">

                  <strong>
                    {item.name}
                  </strong>

                  {!!item.options
                    .length && (
                    <small>
                      {item.options
                        .map(
                          (
                            option
                          ) =>
                            `${option.name}: ${option.value}`
                        )
                        .join(
                          ' / '
                        )}
                    </small>
                  )}

                  <span>
                    수량{' '}
                    {
                      item.quantity
                    }
                  </span>

                </div>

                <div className="order-product-price">
                  <strong>
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                    원
                  </strong>
                </div>

              </div>
            ))}

          </section>

          {/* 구매자 정보 */}
          <section className="order-section">

            <h3>
              주문자 정보
            </h3>

            <TextField
              className="order-field"
              id="order-name"
              type="text"
              label="이름"
              value={name}
              onChange={(event) => setName(event.target.value)} 
              autoComplete="name"
              required={true}
            />

            <TextField
              className="order-field"
              id="order-phone"
              type="text"
              label="연락처"
              value={phone}
              onChange={(event) =>
                setPhone(
                  formatPhone(
                    event.target.value
                  )
                )
              }
              required={true}
            />

            {deliveryMethod === 'delivery' && (
              <>
                <TextField
                  className="order-field"
                  id="order-postcode"
                  type="text"
                  label="우편번호"
                  value={postcode}
                  onClick={
                    handleAddressSearch
                  }
                  readOnly={true}
                  required={true}
                >
                  <button
                    type="button"
                    onClick={
                      handleAddressSearch
                    }
                  >
                    주소 검색
                  </button>
                </TextField>

                <TextField
                  className="order-field"
                  id="order-address"
                  type="text"
                  label="주소"
                  value={address}
                  onClick={
                    handleAddressSearch
                  }
                  readOnly={true}
                  required={true}
                />

                <TextField
                  className="order-field"
                  id="order-detail-address"
                  type="text"
                  label="상세주소"
                  value={detailAddress}
                  onChange={(event) =>
                    setDetailAddress(
                      event.target.value
                    )
                  }
                  required={true}
                  ref={detailAddressRef}
                />
              </>
            )}

            <TextareaField 
              className="order-field"
              id="order-memo"
              label="요청사항"
              value={memo}
              onChange={(event) =>
                setMemo(
                  event.target.value
                )
              }
              rows={5}
            />

          </section>

          {/* 개인정보 */}
          <section className="order-section privacy-section">

            <label className="privacy-check">

              <input
                type="checkbox"
                checked={
                  privacyAgreed
                }
                onChange={(event) =>
                  setPrivacyAgreed(
                    event.target
                      .checked
                  )
                }
              />

              <span>
                개인정보 수집·이용에
                동의합니다.
                <em>
                  (필수)
                </em>
              </span>

            </label>

            <div className="privacy-content">
              <p>
                수집 항목:
                이름, 연락처,
                배송지 정보
              </p>

              <p>
                이용 목적:
                주문 신청 확인 및
                상품 배송
              </p>

              <p>
                보유 기간:
                관련 법령 및 내부
                정책에 따른 보관 기간
              </p>
            </div>

          </section>

          <section className="order-section order-price-summary">

            <div className="order-price-row">
              <span>
                상품금액
              </span>

              <span>
                {totalPrice.toLocaleString()}
                원
              </span>
            </div>

            <div className="order-price-row">
              <span>
                배송비
              </span>

              <span>
                {deliveryFee > 0
                  ? `${deliveryFee.toLocaleString()}원`
                  : '0원'}
              </span>
            </div>

            <div className="order-price-row total">
              <span>
                총 주문금액
              </span>

              <strong>
                {finalPrice.toLocaleString()}
                <small>원</small>
              </strong>
            </div>

          </section>

          {error && (
            <p
              className="order-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="order-submit"
            disabled={
              loading ||
              !privacyAgreed
            }
          >
            <span>
              {loading
                ? '신청 중...'
                : '주문 신청하기'}
            </span>
          </button>

        </div>

        {/*<div className="order-footer">

          {error && (
            <p
              className="order-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="order-total">
            <span>
              총 금액
            </span>

            <strong>
              {finalPrice.toLocaleString()}
              원
            </strong>
          </div>
        </div>*/}
      </form>
    </>
  );
}