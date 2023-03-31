export const isMobileDevice = () => {
  return typeof navigator !== "undefined"
    ? navigator.userAgent.match(/android|webos|iphone|ipad|ipod|blackberry/i) &&
        true
    : true;
};
