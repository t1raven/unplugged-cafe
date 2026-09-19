export const SITE_SETTINGS_QUERY = `
  *[
    _type == "siteSettings" &&
    _id == "siteSettings"
  ][0] {
    siteName,
    address,
    phone,
    businessHours,
    deliveryFee,
    depositAccount,

    seo {
      title,
      description,
      keywords,
      ogImage
    }
  }
`;