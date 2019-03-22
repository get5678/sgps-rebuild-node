'use strict';

/**
 * 自动生成  用于sql语句拼接的字符串
 * @param {Array} array 传入的数组
 * [{name: 'product', key: 'op.product_id', isString: false}]
 * @return {String} 类似'{',
 * '"product":', op.product_id, ',',
 * '"op_quantity": ', op.op_quantity, ',',
 * '"op_price":', op.op_price, ',',
 * '"op_picture":', '"',op.op_picture, '"',
 * '}'
 */
const concatGenerator = array => {
  let str = "'{',  ";
  const last = array.length - 1;
  array.forEach((element, index) => {
    str += `
      '"${element.name}": ', ${element.isString
  ? `'"', ${element.key}, '"'`
  : `${element.key}`}, '${index === last ? '' : ','}',
    `;
  });
  str += "'}'";

  return str;
};

const jsonParse = (array, attr) => {
  return array.map(item => {
    item[attr] = JSON.parse(item[attr]);
    return item;
  });
};

export {
  concatGenerator,
  jsonParse,
};
