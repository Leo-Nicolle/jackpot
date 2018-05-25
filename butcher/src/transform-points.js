
function transformPoint(point, width, height, debug = true) {
  if (point.x === undefined || point.y === undefined) throw { type: 'pointError', reason: 'undefined coordinate' };
  if (isNaN(point.x) || isNaN(point.y)) throw { type: 'pointError', reason: 'NaN coordinate' };
  if (point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) throw { type: 'pointError', reason: 'invalid coordinate' };

  if (debug) {
    return {
      x: Math.round(point.u * width),
      y: Math.round((1 - point.v) * height),
    };
  }
  return {
    x: Math.round(point.point.u * width),
    y: Math.round((1 - point.point.v) * height),
  };
}

module.exports = function (points, width, height, debug = false) {
  const res = [];
  if (debug) {
    Object.entries(points).forEach(([key, value]) => {
      const transformedPoint = transformPoint(value.point, width, height, debug);
      transformedPoint.name = key;
      res.push(transformedPoint);
    });
  } else {
    Object.entries(points).forEach(([key, value]) => {
      const transformedPoint = transformPoint(value, width, height);
      transformedPoint.name = key;
      res.push(transformedPoint);
    });
  }
  return res;
};
