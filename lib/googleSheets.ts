import { google } from 'googleapis';

const email =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

const privateKey =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

const spreadsheetId =
  process.env.GOOGLE_SHEET_ID;

if (
  !email ||
  !privateKey ||
  !spreadsheetId
) {
  throw new Error(
    'Google Sheets 환경변수가 설정되지 않았습니다.'
  );
}

const auth = new google.auth.JWT({
  email,

  key: privateKey.replace(
    /\\n/g,
    '\n'
  ),

  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const sheets = google.sheets({
  version: 'v4',
  auth,
});

const SHEET_NAME = '주문내역';

export async function insertOrderRow(
  row: (
    | string
    | number
    | boolean
    | null
  )[]
) {
  const sheetId =
    await getSheetId(
      SHEET_NAME
    );

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,

    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',

              // 0-based
              // 1 = 실제 2행
              startIndex: 1,
              endIndex: 2,
            },
            inheritFromBefore: false,
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,

    range: `${SHEET_NAME}!A2:K2`,

    valueInputOption: 'USER_ENTERED',

    requestBody: {
      values: [row],
    },
  });
}

async function getSheetId(
  sheetName: string
) {
  const response =
    await sheets.spreadsheets.get({
      spreadsheetId,

      fields:
        'sheets.properties',
    });

  const sheet =
    response.data.sheets?.find(
      (sheet) =>
        sheet.properties?.title ===
        sheetName
    );

  const sheetId =
    sheet?.properties?.sheetId;

  if (
    sheetId === undefined
  ) {
    throw new Error(
      `${sheetName} 시트를 찾을 수 없습니다.`
    );
  }

  return sheetId;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string
) {
  /*
   * A열 = 주문번호
   */
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId,

      range: `${SHEET_NAME}!A:A`,
    });

  const values =
    response.data.values ?? [];

  const rowIndex =
    values.findIndex(
      (row) =>
        row[0] === orderNumber
    );

  if (rowIndex === -1) {
    throw new Error(
      `Google Sheets에서 주문번호 ${orderNumber}를 찾을 수 없습니다.`
    );
  }

  /*
   * 배열 index는 0부터
   * Google Sheet 행은 1부터
   */
  const sheetRow =
    rowIndex + 1;

  /*
   * K열 = 주문상태
   */
  await sheets.spreadsheets.values.update({
    spreadsheetId,

    range:
      `${SHEET_NAME}!B${sheetRow}`,

    valueInputOption:
      'USER_ENTERED',

    requestBody: {
      values: [
        [status],
      ],
    },
  });
}

export function getOrderStatusLabel(
  status: string
) {
  const labels:
    Record<string, string> = {
      pending: '신청',
      confirmed: '확인',
      paid: '입금완료',
      completed: '수령완료',
      cancelled: '취소',
    };

  return (
    labels[status] ??
    status
  );
}