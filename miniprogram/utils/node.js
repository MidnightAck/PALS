const request = require('request');
var ih_request = {};
module.exports = ih_request;
ih_request.get = async function (option) {
  var res = await req({
    url: option.url,
    method: 'get'
  });
  res.result ? option.success(res.msg) : option.error(res.msg);
}