
exports.hasProperty = function(objects, props) {
  var has = true;
  for(var i = 0; i < props.length; i++) {
    if (!objects.hasOwnProperty(props[i])) {
      has = false;
      break;
    }
  }
  return has;
}

exports.sort_by = function(field, reverse, primer){

  var key = primer ? 
    function(x) {return primer(x[field])} : 
    function(x) {return x[field]};

  reverse = [-1, 1][+!!reverse];

  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  } 
}

exports.zeroPad = function(num, numZeros) {
  var n = Math.abs(num);
  var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
  var zeroString = Math.pow(10,zeros).toString().substr(1);
  if( num < 0 ) {
    zeroString = '-' + zeroString;
  }

  return zeroString+n;
}

exports.randomString = function (bits) {

  var chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab';
  var rand;
  var i;
  var randomizedString = '';

  // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey
  // it gives 53)
  while (bits > 0) {
    // 32-bit integer
    rand = Math.floor(Math.random() * 0x100000000);
    // base 64 means 6 bits per character, so we use the top 30 bits from rand
    // to give 30/6=5 characters.
    for (i = 26; i > 0 && bits > 0; i -= 6, bits -= 6) {
      randomizedString += chars[0x3F & rand >>> i];
    }
  }

  return randomizedString;
};
