var fs              = require('fs');
var path            = require('path');
var md5             = require('md5');
var crypto          = require('crypto');
const moment        = require('moment');

exports.generateRandomCode = function() {
    return Math.floor(Math.random() * 90000) + 10000;
}

exports.encriptarDato = function( data ) {
     var generator = crypto.createHash('sha1').update(data).digest('hex');
     return generator;
}

exports.generateUUID =  function() {
  return '0' + (
    Number(String(Math.random()).slice(2)) + Date.now()
  ).toString(36);
}

exports.addMinutes = function(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

exports.addDays = function(date, days) {
    date = new Date(date);
    return date.setDate(date.getDate() + days);
}

exports.setTime = function(date, hour, minute, second) {
    date = new Date(date);
    date.setHours(hour,minute,second);
    // date.setMinutes(minute);
    // date.setSeconds(second);
    return date;
}

exports.datoToMonthYear = function(fecha) {
    var result = {};
    result.mes = fecha.getMonth() + 1;
    result.anio = fecha.getFullYear();
    return result;
}

exports.returnMonth = function(fechaRaw){
    var fecha = moment(fechaRaw);
    return parseInt(fecha.utc().format('MM'))
}

exports.returnYear = function(fechaRaw){
    var fecha = moment(fechaRaw);
    return parseInt(fecha.utc().format('YYYY'))
}

exports.isEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

exports.daysBetween = function( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;
  
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
  
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
      
    // Convert back to days and return
    return Math.round(difference_ms/one_day); 
}

exports.storeWithOriginalName = function(file) {
    var fullNewPath = path.join(file.destination, file.originalname)
    fs.renameSync(file.path, fullNewPath)

    return file.originalname;
}