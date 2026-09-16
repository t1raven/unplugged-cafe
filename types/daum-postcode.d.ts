export {};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => {
        open: () => void;
      };
    };
  }

  interface DaumPostcodeData {
    zonecode: string;
    address: string;
    roadAddress: string;
    jibunAddress: string;
    userSelectedType: 'R' | 'J';

    buildingName?: string;
    apartment?: 'Y' | 'N';

    bname?: string;
  }
}