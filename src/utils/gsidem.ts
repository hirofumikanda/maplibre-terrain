export const gsidem2terrainrgb = (
  r: number,
  g: number,
  b: number
): number[] => {
  let height = r * 655.36 + g * 2.56 + b * 0.01;
  if (r === 128 && g === 0 && b === 0) {
    height = 0;
  } else if (r >= 128) {
    height -= 167772.16;
  }
  height += 100000;
  height *= 10;

  const tB = (height / 256 - Math.floor(height / 256)) * 256;
  const tG =
    (Math.floor(height / 256) / 256 -
      Math.floor(Math.floor(height / 256) / 256)) *
    256;
  const tR =
    (Math.floor(Math.floor(height / 256) / 256) / 256 -
      Math.floor(Math.floor(Math.floor(height / 256) / 256) / 256)) *
    256;

  return [tR, tG, tB];
};
