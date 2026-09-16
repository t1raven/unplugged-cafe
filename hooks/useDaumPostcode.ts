'use client';

import { useCallback } from 'react';

interface AddressResult {
  postcode: string;
  address: string;
}

interface Options {
  onComplete: (
    result: AddressResult
  ) => void;
}

const SCRIPT_ID =
  'daum-postcode-script';

const SCRIPT_URL =
  '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export function useDaumPostcode({
  onComplete,
}: Options) {
  const loadScript =
    useCallback(() => {
      return new Promise<void>(
        (resolve, reject) => {
          if (window.daum?.Postcode) {
            resolve();
            return;
          }

          const existingScript =
            document.getElementById(
              SCRIPT_ID
            ) as HTMLScriptElement | null;

          if (existingScript) {
            existingScript.addEventListener(
              'load',
              () => resolve(),
              {
                once: true,
              }
            );

            existingScript.addEventListener(
              'error',
              () =>
                reject(
                  new Error(
                    '주소 검색 스크립트를 불러오지 못했습니다.'
                  )
                ),
              {
                once: true,
              }
            );

            return;
          }

          const script =
            document.createElement(
              'script'
            );

          script.id = SCRIPT_ID;
          script.src = SCRIPT_URL;

          script.async = true;

          script.onload = () =>
            resolve();

          script.onerror = () =>
            reject(
              new Error(
                '주소 검색 스크립트를 불러오지 못했습니다.'
              )
            );

          document.head.appendChild(
            script
          );
        }
      );
    }, []);

  const openPostcode =
    useCallback(async () => {
      await loadScript();

      if (!window.daum?.Postcode) {
        throw new Error(
          '주소 검색 서비스를 사용할 수 없습니다.'
        );
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const selectedAddress =
            data.userSelectedType ===
            'R'
              ? data.roadAddress
              : data.jibunAddress;

          onComplete({
            postcode:
              data.zonecode,

            address:
              selectedAddress ||
              data.address,
          });
        },
      }).open();
    }, [
      loadScript,
      onComplete,
    ]);

  return {
    openPostcode,
  };
}