import { NextResponse } from 'next/server';

import { writeClient } from '@/sanity/lib/writeClient';
import { normalizePhone } from '@/utils/formatPhone';
import type { OrderTrackingResult } from '@/types/order';

interface TrackingRequest {
  name?: string;
  phone?: string;
}

const ORDER_QUERY = `
  *[
    _type == "purchaseOrder" &&
    customer.name == $name
  ] | order(createdAt desc) {
    orderNumber,
    createdAt,
    deliveryMethod,
    customer,
    items[]{
      name,
      options[]{name, value},
      price,
      quantity,
      subtotal
    },
    productPrice,
    deliveryFee,
    totalPrice,
    memo,
    status
  }
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackingRequest;
    const name = body.name?.trim();
    const phone = normalizePhone(body.phone ?? '');

    if (!name || !/^01[016789]\d{7,8}$/.test(phone)) {
      return NextResponse.json(
        { message: '이름과 올바른 연락처를 입력해주세요.' },
        { status: 400 }
      );
    }

    const candidates = await writeClient.fetch<OrderTrackingResult[]>(
      ORDER_QUERY,
      { name }
    );

    const orders = candidates.filter(
      (order) => normalizePhone(order.customer?.phone ?? '') === phone
    );

    return NextResponse.json(
      { orders },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[POST /api/order/tracking]', error);

    return NextResponse.json(
      { message: '주문 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
