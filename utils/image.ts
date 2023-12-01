export const getUrl = (imageUrl: string | File | null) => {
  if (imageUrl === undefined || imageUrl === null) {
    return "";
  }
  if (typeof imageUrl === "object" && imageUrl instanceof File) {
    return URL.createObjectURL(imageUrl);
  }
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `https://${imageUrl}`;
};
export const validUrl = (imageUrl: string | File | undefined) => {
  if (imageUrl === undefined || imageUrl === null) {
    return false;
  }
  if (typeof imageUrl === "object" && imageUrl instanceof File) {
    return true;
  }
  if (
    process.env.NEXT_PUBLIC_IMAGE_DOMAINS &&
    process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",").includes(
      new URL(getUrl(imageUrl)).hostname
    )
  ) {
    return true;
  }
  return false;
};
