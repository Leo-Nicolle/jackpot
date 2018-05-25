
function transformPoint(point, width, height) {
  if (point.x === undefined || point.y === undefined) throw Error('undefined coordinate');
  if (Math.isNaN(point.x) || Math.isNaN(point.y)) throw Error('NaN coordinate');
  if (point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) throw Error('invalid coordinate');
  return {
    x: Math.round(point.point.u * width),
    y: Math.round((1 - point.point.v) * height),
  };
}

module.exports = function (points, width, height) {
  const res = {};
  Object.entries(points).forEach(([key, value]) => {
    res[key] = transformPoint(value, width, height);
  });
  return res;
};
