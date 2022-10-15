export const preloadImage = async (src: string): Promise<void> => {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      img.onload = null;
      res();
    };
    img.src = src;
  });
};
