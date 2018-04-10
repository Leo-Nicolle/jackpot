module.exports = function (points, width, height, fromFile = false) {
  const res = {};
  if (fromFile) {
    Object.entries(points).forEach(([key, value]) => {
      res[key] = {
        x: Math.round(value.point.u * width),
        y: Math.round((1 - value.point.v) * height),
      };
    });
  } else {
    Object.entries(points).forEach(([key, value]) => {
      res[key] = {
        x: Math.round(value.u * width),
        y: Math.round((1 - value.v) * height),
      };
    });
  }
  return res;
};
