let initSelectAttrs = [];
let reformAttributeIDsArr = [];
let skuData = {};

function reformAllSkuInfo(attributesData) {
  // 从所有的sku信息里面清洗出有用的
  const allSkuInfo = attributesData.allskuinfo;
  for (let i = 0; i < allSkuInfo.length; i++) {
    let skuDic = {};
    skuDic['skuStock'] = allSkuInfo[i].stock;
    skuDic['key'] = allSkuInfo[i].selectinfo;
    skuDic['skuPrice'] = allSkuInfo[i].newprice;
    skuDic['skuID'] = allSkuInfo[i].id;
    skuDic['skuMinPurchase'] = allSkuInfo[i].minpurchase;
    // skuDic['picUrl'] = allSkuInfo[i].pic.url;

    //----------筛选出每种 属性 和 组合属性 对应的信息---------------
    if (skuDic['skuStock'] == 0) {
      continue
    }
    
    // 提取每种最大组合的attribute ids，并升序排列
    let attrIdsArr = skuDic['key'].split(',').sort();
    // 提取所有子类id组合，包括''和自身
    let comAttrIdsArr = comSubList(attrIdsArr);
    // 累加每种子类id组合对应的属性信息
    for (let index in comAttrIdsArr) {
      addSkuData(comAttrIdsArr[index], skuDic)
    }
  }

  // 提取出所有属性ids，二维数组
  const selectInfo = attributesData.selectinfo;
  for (let i = 0; i < selectInfo.length; i++) {
    const attributeArr = selectInfo[i].attribute;
    let innerArr = [];
    for (let j = 0; j < attributeArr.length; j++) {
      innerArr[j] = attributeArr[j].id;
    }
    reformAttributeIDsArr[i] = innerArr;

    // 初始未选择的填充空字符串, 初始判断按钮是否可以选择用
    initSelectAttrs.push('');
  }
}

// 提取数组所有子类id组合
function comSubList(arr) {
  if (arr.length == 0) {
    return [''];
  }

  var result = [];
  var pow = Math.pow(2, arr.length);
  for (let a = 1; a < pow; a++) {
    var char1 = a.toString(2).split("");
    var cl = char1.length;
    var d = "";
    for (var i = 0; i < cl; i++) {
      d = d + char1[cl - i - 1];
    }
    var chars = d.split("");
    var p = "";
    for (let j = 0; j < char1.length; j++) {
      var c = parseInt(chars[j] + "");
      if (0 != c) {
        p = p + c * arr[j] + ",";
      }
    }
    p = p.substring(0, p.length - 1);
    result.push(p);
  }
  result.push('');
  return result;
}

// 累加每种子类id组合对应的属性信息
function addSkuData(key, skuDic) {
  let info = {};
  // if (!skuData.hasOwnProperty(key)) {
    info = {"stock" : 0, "prices": [], "skuIds": [], "minPurchase": 0};
  // }
  // else {
  //   info = skuData[key];
  // }

  // 获取旧值
  let stock = info.stock;
  let prices = info.prices;
  let skuIds = info.skuIds;
  let minPurchase = info.minPurchase;
  
  // 设置新值
  stock = stock + skuDic.skuStock;
  if (prices.indexOf(skuDic.skuPrice) == -1) {
    prices.push(skuDic.skuPrice);
    prices.sort();
  }
  skuIds.push(skuDic.skuID);
  minPurchase = minPurchase > skuDic.skuMinPurchase ? minPurchase : skuDic.skuMinPurchase;

  // 拼装字典
  const newInfo = { "stock": stock, "prices": prices, "skuIds": skuIds, "minPurchase": minPurchase };

  // 更新skuData
  skuData[key] = newInfo;
}

// 选择属性后，其他相应可选属性
function enabledAttributesForSelectedAttributes(attributes) {
  let result = [];
  for (let i = 0; i < reformAttributeIDsArr.length; i++) {
    const attrs = reformAttributeIDsArr[i];
    let selectedAttr = [];
    Object.assign(selectedAttr, attributes)

    for (let j = 0; j < attrs.length; j++) {
      selectedAttr[i] = attrs[j];
      const key = skuKeyString(selectedAttr);

      if (skuData.hasOwnProperty(key)) {
        result.push(attrs[j]);
      }
    }
  }

  return result;
}

/** 清洗数据,删除空串,排序,然后用,拼接,作为sku的key */
function skuKeyString(array) {
  let reformedArray = [];

  // 清洗空串
  for (let i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      reformedArray.push(array[i]);
    }
  }
  // 无数据，返回空字符串
  if (reformedArray.length == 0) {
    return "";
  }
  // 排序
  let sortedKeys = reformedArray.sort();
  // 拼接
  const key = sortedKeys.join(',');

  return key;
}

module.exports = {
  reformAllSkuInfoFac: reformAllSkuInfo,
  enabledAttributesFac: enabledAttributesForSelectedAttributes,
  reformSkuKeyStringFac: skuKeyString,
  initSelectAttrs: initSelectAttrs,
  skuData: skuData
}