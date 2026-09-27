import { NextResponse } from 'next/server';

import { writeClient } from '@/sanity/lib/writeClient';
import { normalizePhone } from '@/utils/formatPhone';

interface CancelRequest {
  orderNumber?: string;
  name?: string;
  phone?: string;
}

interface OrderDocument {
  _id: string;
  _rev: string;
  status?: string;
  customer?: {
    name?: string;
    phone?: string;
  };
}

const CANCELLABLE_STATUSES = new Set(['pending', 'confirmed']);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CancelRequest;
    const orderNumber = body.orderNumber?.trim();
    const name = body.name?.trim();
    const phone = normalizePhone(body.phone ?? '');

    if (!orderNumber || !name || !/^01[016789]\d{7,8}$/.test(phone)) {
      return NextResponse.json(
        { message: '주문 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const order = await writeClient.fetch<OrderDocument | null>(
      `*[
        _type == "purchaseOrder" &&
        orderNumber == $orderNumber &&
        customer.name == $name
      ][0]{_id, _rev, status, customer{name, phone}}`,
      { orderNumber, name }
    );

    if (
      !order ||
      normalizePhone(order.customer?.phone ?? '') !== phone
    ) {
      return NextResponse.json(
        { message: '주문 정보를 확인할 수 없습니다.' },
        { status: 404 }
      );
    }

    if (!CANCELLABLE_STATUSES.has(order.status ?? '')) {
      return NextResponse.json(
        { message: '현재 상태에서는 주문을 취소할 수 없습니다.' },
        { status: 409 }
      );
    }

    await writeClient
      .patch(order._id)
      .ifRevisionId(order._rev)
      .set({ status: 'cancelled' })
      .commit();

    return NextResponse.json({
      success: true,
      orderNumber,
      status: 'cancelled',
    });
  } catch (error) {
    console.error('[POST /api/order/cancel]', error);

    const isConflict =
      error instanceof Error &&
      /revision|conflict/i.test(error.message);

    return NextResponse.json(
      {
        message: isConflict
          ? '주문 상태가 변경되었습니다. 다시 조회해주세요.'
          : '주문 취소 중 오류가 발생했습니다.',
      },
      { status: isConflict ? 409 : 500 }
    );
  }
}
