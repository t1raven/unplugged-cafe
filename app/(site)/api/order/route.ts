import { NextResponse } from 'next/server';

import { writeClient } from '@/sanity/lib/writeClient';
import { appendOrderRow } from '@/lib/googleSheets';

import type {
  OrderRequest,
  OrderRequestItem,
} from '@/types/order';

import { normalizePhone, formatPhone } from "@/utils/formatPhone";

interface GoodsDocument {
  _id: string;

  name: string;

  price: number;

  stock: number;

  soldOut: boolean;

  isAvailable: boolean;

  options?: {
    name: string;
    values: string[];
  }[];
}

interface ValidatedItem {
  _key: string;
  _type: 'purchaseOrderItem';

  goods: {
    _type: 'reference';
    _ref: string;
  };

  goodsId: string;

  name: string;

  options: {
    _key: string;
    name: string;
    value: string;
  }[];

  price: number;
  quantity: number;
  subtotal: number;
}

const GOODS_QUERY = `
  *[
    _type == "goodsItem" &&
    _id in $ids
  ] {
    _id,
    name,
    price,
    stock,
    soldOut,
    isAvailable,

    options[]{
      name,
      values
    }
  }
`;

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as OrderRequest;

    /*
     * 1. 기본 요청 검증
     */
    validateRequest(body);

    /*
     * 2. 중복 ID 제거
     */
    const goodsIds = [
      ...new Set(
        body.items.map(
          (item) => item.goodsId
        )
      ),
    ];

    /*
     * 3. Sanity 원본 상품 조회
     */
    const goods =
      await writeClient.fetch<
        GoodsDocument[]
      >(
        GOODS_QUERY,
        {
          ids: goodsIds,
        }
      );

    /*
     * 존재하지 않는 상품 체크
     */
    if (
      goods.length !==
      goodsIds.length
    ) {
      return NextResponse.json(
        {
          message:
            '존재하지 않는 상품이 포함되어 있습니다.',
        },
        {
          status: 400,
        }
      );
    }

    const goodsMap =
      new Map(
        goods.map((item) => [
          item._id,
          item,
        ])
      );

    /*
     * 4. 주문 항목 검증
     */
    const validatedItems:
      ValidatedItem[] = [];

    for (
      const item of body.items
    ) {
      const goods =
        goodsMap.get(
          item.goodsId
        );

      if (!goods) {
        throw new Error(
          '상품 정보를 찾을 수 없습니다.'
        );
      }

      validateGoods(
        goods,
        item
      );

      const subtotal =
        goods.price *
        item.quantity;

      validatedItems.push({
        _key:
          crypto.randomUUID(),

        _type:
          'purchaseOrderItem',

        goods: {
          _type: 'reference',
          _ref: goods._id,
        },

        goodsId:
          goods._id,

        /*
         * 클라이언트 상품명이 아니라
         * Sanity 원본 사용
         */
        name:
          goods.name,

        options:
          item.options.map(
            (option) => ({
              _key:
                crypto.randomUUID(),

              name:
                option.name,

              value:
                option.value,
            })
          ),

        /*
         * 클라이언트 가격이 아니라
         * Sanity 원본 사용
         */
        price:
          goods.price,

        quantity:
          item.quantity,

        subtotal,
      });
    }

    /*
     * 5. 총액 서버 계산
     */
    const totalPrice =
      validatedItems.reduce(
        (total, item) =>
          total +
          item.subtotal,
        0
      );

    /*
     * 6. 주문번호
     */
    const orderNumber =
      createOrderNumber();

    const now =
      new Date().toISOString();

    /*
     * 7. Sanity 주문 생성
     */
    const createdOrder =
      await writeClient.create({
        _type: 'purchaseOrder',

        orderNumber,
        createdAt: now,

        deliveryMethod:
          body.deliveryMethod,

        customer: {
          name:
            body.customer.name.trim(),

          phone:
            formatPhone(
              body.customer.phone
            ),

          address:
            body.deliveryMethod ===
            'delivery'
              ? {
                  postcode:
                    body.customer
                      .address!
                      .postcode,

                  address:
                    body.customer
                      .address!
                      .address,

                  detailAddress:
                    body.customer
                      .address!
                      .detailAddress,
                }
              : undefined,
        },

        items:
          validatedItems,

        totalPrice,

        memo:
          body.memo?.trim() ||
          '',

        status: 'pending',

        privacyAgreed: true,

        privacyAgreedAt: now,

        sheetSynced: false,
      });

    /*
     * Google Sheets 동기화
     */
    try {
      const itemText = validatedItems
        .map((item) => {
          const optionText =
            item.options.length > 0
              ? ` (${item.options
                  .map(
                    (option) =>
                      `${option.name}:${option.value}`
                  )
                  .join(', ')})`
              : '';

          return `${item.name}${optionText} × ${item.quantity}`;
        })
        .join(' / ');


      let addressText = '';

      if (body.deliveryMethod === 'delivery' && body.customer?.address) {
        const { address = '', detailAddress = '', postcode = '' } = body.customer.address;
        addressText = `${address} ${detailAddress} (${postcode})`.trim();
      }

      const totalQuantity =
        validatedItems.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );

      const row = [
        orderNumber,

        formatDateTime(now),

        body.deliveryMethod === 'delivery'
          ? '배송'
          : '픽업',

        body.customer.name.trim(),

        formatPhone(
          body.customer.phone
        ),

        body.deliveryMethod === 'delivery'
          ? addressText ?? ''
          : '',

        /*body.deliveryMethod === 'delivery'
          ? body.customer.address
              ?.postcode ?? ''
          : '',

        body.deliveryMethod === 'delivery'
          ? body.customer.address
              ?.address ?? ''
          : '',

        body.deliveryMethod === 'delivery'
          ? body.customer.address
              ?.detailAddress ?? ''
          : '',*/

        itemText,

        totalQuantity,

        totalPrice,

        body.memo?.trim() || '',

        '신청',
      ];

      await appendOrderRow(
        row
      );

      await writeClient
        .patch(createdOrder._id)
        .set({
          sheetSynced: true,

          sheetSyncedAt:
            new Date().toISOString(),
        })
        .unset([
          'sheetSyncError',
        ])
        .commit();
    } catch (sheetError) {
      console.error(
        '[Google Sheets Sync]',
        sheetError
      );

      await writeClient
        .patch(createdOrder._id)
        .set({
          sheetSynced: false,

          sheetSyncError:
            sheetError instanceof
            Error
              ? sheetError.message
              : 'Google Sheets 동기화 실패',
        })
        .commit();
    }

    return NextResponse.json(
      {
        success: true,

        orderNumber,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      '[POST /api/order]',
      error
    );

    if (
      error instanceof OrderError
    ) {
      return NextResponse.json(
        {
          message:
            error.message,
        },
        {
          status:
            error.status,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          '구매 신청 처리 중 오류가 발생했습니다.',
      },
      {
        status: 500,
      }
    );
  }
}


class OrderError extends Error {
  status: number;

  constructor(
    message: string,
    status = 400
  ) {
    super(message);

    this.name =
      'OrderError';

    this.status =
      status;
  }
}

function validateRequest(
  body: OrderRequest
) {
  if (
    !body ||
    typeof body !== 'object'
  ) {
    throw new OrderError(
      '잘못된 요청입니다.'
    );
  }

  if (
    body.deliveryMethod !==
      'delivery' &&
    body.deliveryMethod !==
      'pickup'
  ) {
    throw new OrderError(
      '배송방법을 선택해주세요.'
    );
  }

  if (
    !body.customer?.name?.trim()
  ) {
    throw new OrderError(
      '이름을 입력해주세요.'
    );
  }

  if (
    !body.customer?.phone?.trim()
  ) {
    throw new OrderError(
      '연락처를 입력해주세요.'
    );
  }

  const phone =
    normalizePhone(
      body.customer.phone
    );

  if (
    !/^01[016789]\d{7,8}$/.test(
      phone
    )
  ) {
    throw new OrderError(
      '올바른 연락처를 입력해주세요.'
    );
  }

  /*
   * 배송일 때만 주소 필수
   */
  if (
    body.deliveryMethod ===
    'delivery'
  ) {
    if (
      !body.customer.address
    ) {
      throw new OrderError(
        '배송 주소를 입력해주세요.'
      );
    }

    const {
      postcode,
      address,
      detailAddress,
    } =
      body.customer.address;

    if (
      !postcode?.trim() ||
      !address?.trim() ||
      !detailAddress?.trim()
    ) {
      throw new OrderError(
        '배송 주소를 모두 입력해주세요.'
      );
    }
  }

  if (
    body.privacyAgreed !==
    true
  ) {
    throw new OrderError(
      '개인정보 수집·이용 동의가 필요합니다.'
    );
  }

  if (
    !Array.isArray(
      body.items
    ) ||
    body.items.length === 0
  ) {
    throw new OrderError(
      '주문 상품이 없습니다.'
    );
  }

  if (
    body.items.length > 30
  ) {
    throw new OrderError(
      '한 번에 주문할 수 있는 상품 수를 초과했습니다.'
    );
  }

  for (
    const item of body.items
  ) {
    if (
      !item.goodsId ||
      typeof item.goodsId !==
        'string'
    ) {
      throw new OrderError(
        '잘못된 상품 정보입니다.'
      );
    }

    if (
      !Number.isInteger(
        item.quantity
      ) ||
      item.quantity < 1
    ) {
      throw new OrderError(
        '잘못된 상품 수량입니다.'
      );
    }

    if (
      !Array.isArray(
        item.options
      )
    ) {
      throw new OrderError(
        '잘못된 상품 옵션입니다.'
      );
    }
  }
}

function validateGoods(
  goods: GoodsDocument,
  item: OrderRequestItem
) {
  /*
   * 판매 중인지
   */
  if (
    !goods.isAvailable
  ) {
    throw new OrderError(
      `${goods.name}은(는) 현재 판매 중인 상품이 아닙니다.`
    );
  }

  /*
   * 품절 여부
   */
  if (goods.soldOut) {
    throw new OrderError(
      `${goods.name}은(는) 품절되었습니다.`
    );
  }

  /*
   * 수량 / 재고
   */
  if (
    item.quantity >
    goods.stock
  ) {
    throw new OrderError(
      `${goods.name}의 재고가 부족합니다.`
    );
  }

  const goodsOptions =
    goods.options ?? [];

  /*
   * 옵션 없는 상품
   */
  if (
    goodsOptions.length === 0
  ) {
    if (
      item.options.length >
      0
    ) {
      throw new OrderError(
        `${goods.name}에는 선택할 수 있는 옵션이 없습니다.`
      );
    }

    return;
  }

  /*
   * 필요한 옵션 개수와
   * 전달된 옵션 개수 비교
   */
  if (
    item.options.length !==
    goodsOptions.length
  ) {
    throw new OrderError(
      `${goods.name}의 옵션을 모두 선택해주세요.`
    );
  }

  /*
   * 동일 옵션명 중복 방지
   */
  const optionNames =
    item.options.map(
      (option) =>
        option.name
    );

  if (
    new Set(optionNames).size !==
    optionNames.length
  ) {
    throw new OrderError(
      `${goods.name}의 옵션 정보가 올바르지 않습니다.`
    );
  }

  /*
   * Sanity 옵션 검증
   */
  for (
    const goodsOption of
    goodsOptions
  ) {
    const selected =
      item.options.find(
        (option) =>
          option.name ===
          goodsOption.name
      );

    if (!selected) {
      throw new OrderError(
        `${goods.name}의 ${goodsOption.name} 옵션을 선택해주세요.`
      );
    }

    if (
      !goodsOption.values.includes(
        selected.value
      )
    ) {
      throw new OrderError(
        `${goods.name}의 ${goodsOption.name} 옵션이 올바르지 않습니다.`
      );
    }
  }
}

function createOrderNumber() {
  const now =
    new Date();

  const year =
    String(
      now.getFullYear()
    ).slice(-2);

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      now.getDate()
    ).padStart(2, '0');

  const random =
    crypto
      .randomUUID()
      .replace(/-/g, '')
      .slice(0, 6)
      .toUpperCase();

  return `G${year}${month}${day}-${random}`;
}

function formatDateTime(d: Date | string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(d));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hours = get('hour');
  const minutes = get('minute');

  return `${year}. ${month}. ${day} ${hours}:${minutes}`;
};