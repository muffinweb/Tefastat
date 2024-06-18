let price = 1987234.3583939;

let priceTag = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(price);

console.log(priceTag);