/**
 * 生成特定长度的随机字符串
 * @param {number} size - 随记字符串的长度
 * @param {string} curtomStrTmp - 自定义随机字符串源
 * @return {string} 随机字符串
 */
export function generateRandomStr(size = 0, curtomStrTmp = '') {
  const tmp = 
    typeof curtomStrTmp === 'string' && curtomStrTmp.length > 0
      ? curtomStrTmp
      : '0123456789zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP';
  const len = tmp.length;
  const rndChars = [];
  for (let i = 0; i < size; i++) {
    rndChars.push(tmp[Math.floor(Math.random() * len)]);
  }

  return rndChars.join('');
}
