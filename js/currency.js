const exponentCache=new Map();
export const exponent=currency=>{const code=(currency||'IDR').toUpperCase();if(exponentCache.has(code))return exponentCache.get(code);let digits=2;try{digits=new Intl.NumberFormat('id-ID',{style:'currency',currency:code}).resolvedOptions().maximumFractionDigits}catch{digits=2}exponentCache.set(code,digits);return digits};
export const toMinor=(value,currency)=>{const n=Number(value),minor=Math.round(n*10**exponent(currency));return Number.isFinite(n)&&n>=0&&Number.isSafeInteger(minor)?minor:null};
export const formatMoney=(minor,currency='IDR')=>{const e=exponent(currency);return new Intl.NumberFormat('id-ID',{style:'currency',currency,maximumFractionDigits:e,minimumFractionDigits:e}).format((Number(minor)||0)/10**e)};
