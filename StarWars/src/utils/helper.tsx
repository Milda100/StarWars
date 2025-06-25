export const extractIdFromUrl = (url: string): string => {
  const match = url.match(/\/(\d+)\/?$/); // Notice the optional trailing slash
  return match ? match[1] : '';
};
