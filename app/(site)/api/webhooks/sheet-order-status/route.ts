import { NextResponse } from 'next/server';

import { writeClient } from '@/sanity/lib/writeClient';

const STATUS_MAP: Record<string, string> = {
  신청: 'pending',
  확인: 'confirmed',
  입금완료: 'paid',
  수령완료: 'completed',
  취소: 'cancelled',
};

interface RequestBody {
  orderNumber?: string;
  status?: string;
}

export async function POST(
  request: Request
) {
  try {
    const authorization =
      request.headers.get(
        'authorization'
      );

    const secret =
      process.env
        .GOOGLE_SHEET_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          message:
            'Webhook secret이 설정되지 않았습니다.',
        },
        {
          status: 500,
        }
      );
    }

    if (
      authorization !==
      `Bearer ${secret}`
    ) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as
        RequestBody;

    const orderNumber =
      body.orderNumber?.trim();

    const sheetStatus =
      body.status?.trim();

    if (
      !orderNumber ||
      !sheetStatus
    ) {
      return NextResponse.json(
        {
          message:
            '주문번호 또는 주문상태가 없습니다.',
        },
        {
          status: 400,
        }
      );
    }

    const status =
      STATUS_MAP[sheetStatus];

    if (!status) {
      return NextResponse.json(
        {
          message:
            '허용되지 않은 주문상태입니다.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 주문번호로 Sanity document 검색
     */
    const order =
      await writeClient.fetch<{
        _id: string;
        status?: string;
      } | null>(
        `
        *[
          _type == "purchaseOrder" &&
          orderNumber == $orderNumber
        ][0]{
          _id,
          status
        }
        `,
        {
          orderNumber,
        }
      );

    if (!order) {
      return NextResponse.json(
        {
          message:
            `주문번호 ${orderNumber}를 찾을 수 없습니다.`,
        },
        {
          status: 404,
        }
      );
    }

    /*
     * 이미 동일 상태면 mutation 생략
     */
    if (
      order.status === status
    ) {
      return NextResponse.json({
        success: true,
        skipped: true,
      });
    }

    await writeClient
      .patch(order._id)
      .set({
        status,
      })
      .commit();

    return NextResponse.json({
      success: true,

      orderNumber,

      status,
    });
  } catch (error) {
    console.error(
      '[Sheet → Sanity status]',
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : '주문상태 변경 실패',
      },
      {
        status: 500,
      }
    );
  }
}