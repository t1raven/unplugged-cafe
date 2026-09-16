'use client';

import {
  FormEvent,
  useRef,
  useState,
} from 'react';

import {
  useDaumPostcode,
} from '@/hooks/useDaumPostcode';

import type {
  CartItem,
} from '@/store/cartStore';

import { formatPhone } from "@/utils/formatPhone";

interface Props {
  items: CartItem[];

  totalPrice: number;

  onBack: () => void;

  onComplete: (
    orderNumber: string
  ) => void;
}

type DeliveryMethod =
  | 'delivery'
  | 'pickup';

export default function OrderView({
  items,
  totalPrice,
  onBack,
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
        await fetch('/api/orders', {
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
            arrow_back
          </span>
        </button>

        <h2>구매 신청</h2>

        <div />
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
          </section>

          {/* 구매자 정보 */}
          <section className="order-section">

            <h3>
              구매자 정보
            </h3>

            <div className="order-field">
              <label htmlFor="order-name">
                이름
                <em>*</em>
              </label>

              <input
                id="order-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="order-field">
              <label htmlFor="order-phone">
                연락처
                <em>*</em>
              </label>

              <input
                id="order-phone"
                type="tel"
                inputMode="numeric"
                maxLength={13}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    formatPhone(
                      event.target.value
                    )
                  )
                }
                required
              />
            </div>

            {deliveryMethod === 'delivery' && (
              <>
                <div className="order-field">
                  <label htmlFor="order-postcode">
                    우편번호
                    <em>*</em>
                  </label>

                  <div className="postcode-field">
                    <input
                      id="order-postcode"
                      type="text"
                      value={postcode}
                      readOnly
                      required
                    />

                    <button
                      type="button"
                      onClick={
                        handleAddressSearch
                      }
                    >
                      주소 검색
                    </button>
                  </div>
                </div>

                <div className="order-field">
                  <label htmlFor="order-address">
                    주소
                    <em>*</em>
                  </label>

                  <input
                    id="order-address"
                    type="text"
                    value={address}
                    readOnly
                    required
                    onClick={
                      handleAddressSearch
                    }
                  />
                </div>

                <div className="order-field">
                  <label htmlFor="order-detail-address">
                    상세주소
                    <em>*</em>
                  </label>

                  <input
                    ref={
                      detailAddressRef
                    }
                    id="order-detail-address"
                    type="text"
                    value={
                      detailAddress
                    }
                    onChange={(event) =>
                      setDetailAddress(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>
              </>
            )}

          </section>

          {/* 문의사항 */}
          <section className="order-section">

            <h3>
              요청사항
            </h3>

            <div className="order-field">
              <textarea
                id="order-memo"
                value={memo}
                onChange={(event) =>
                  setMemo(
                    event.target.value
                  )
                }
                rows={5}
              />
            </div>

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
                구매 신청 확인 및
                상품 배송
              </p>

              <p>
                보유 기간:
                관련 법령 및 내부
                정책에 따른 보관 기간
              </p>
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

                <strong>
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString()}
                  원
                </strong>

              </div>
            ))}

          </section>

        </div>

        <div className="order-footer">

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
              총 구매금액
            </span>

            <strong>
              {totalPrice.toLocaleString()}
              원
            </strong>
          </div>

          <button
            type="submit"
            className="order-submit"
            disabled={
              loading ||
              !privacyAgreed
            }
          >
            {loading
              ? '신청 중...'
              : '구매 신청하기'}
          </button>

        </div>
      </form>
    </>
  );
}