import { NextResponse } from 'next/server';

import {
  getOrderStatusLabel,
  updateOrderStatus,
} from '@/lib/googleSheets';

interface OrderWebhookBody {
  orderNumber?: string;
  status?: string;
}

export async function POST(
  request: Request
) {
  try {
    /*
     * Sanity webhook에서 보내는
     * Authorization header 검증
     */
    const authorization =
      request.headers.get(
        'authorization'
      );

    const secret =
      process.env
        .SANITY_ORDER_WEBHOOK_SECRET;

    if (!secret) {
      console.error(
        'SANITY_ORDER_WEBHOOK_SECRET 미설정'
      );

      return NextResponse.json(
        {
          message:
            'Server configuration error',
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
        OrderWebhookBody;

    const {
      orderNumber,
      status,
    } = body;

    if (
      !orderNumber ||
      !status
    ) {
      return NextResponse.json(
        {
          message:
            'orderNumber 또는 status가 없습니다.',
        },
        {
          status: 400,
        }
      );
    }

    const statusLabel =
      getOrderStatusLabel(
        status
      );

    await updateOrderStatus(
      orderNumber,
      statusLabel
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      '[Order status webhook]',
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Webhook 처리 실패',
      },
      {
        status: 500,
      }
    );
  }
}