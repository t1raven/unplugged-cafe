export function normalizePhone(
  phone: string
) {
  return phone.replace(
    /\D/g,
    ''
  );
}

export function formatPhone(
  phone: string
) {
  const value =
    normalizePhone(phone);

  if (
    value.length <= 3
  ) {
    return value;
  }

  if (
    value.length <= 7
  ) {
    return `${value.slice(
      0,
      3
    )}-${value.slice(3)}`;
  }

  return `${value.slice(
    0,
    3
  )}-${value.slice(
    3,
    7
  )}-${value.slice(
    7,
    11
  )}`;

  /*return value.replace(
    /(\d{3})(\d{3,4})(\d{4})/,
    '$1-$2-$3'
  );*/
}