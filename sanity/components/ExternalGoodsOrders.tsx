import {useEffect} from 'react'
import {Card, Stack, Text, Button} from '@sanity/ui'

const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1BMhi_A9kOipxknTtjxOsvhzsbPD8ySNdOEZNOwe6L-4/edit'

export function ExternalGoodsOrders() {
  useEffect(() => {
    window.open(
      GOOGLE_SHEET_URL,
      '_blank',
      'noopener,noreferrer'
    )
  }, [])

  return (
    <Card padding={5}>
      <Stack gap={5}>
        <Text size={2}>
          굿즈 주문내역 Google Sheet를 새 창에서 열었습니다.
        </Text>

        <Button
          text="구글 시트 열기 ↗"
          tone="primary"
          onClick={() => {
            window.open(
              GOOGLE_SHEET_URL,
              '_blank',
              'noopener,noreferrer'
            )
          }}
        />
      </Stack>
    </Card>
  )
}