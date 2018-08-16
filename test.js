
//         var filterDate = new Date();
//         filterDate.setDate(filterDate.getDate() - 1);
        
// var body=
// {
// body:{
//     "view":"VENDOR",
//     "query":"modified=ge="+filterDate.toLocaleString("yyyy-MM-dd'T'HH:mm:ssZ")
// }};

// console.log("body"+ JSON.stringify(body));

// var moment = require('moment');
// var now = new Date();
// var date= moment().format("YYYY-MM-DDTHH:mm:ssZ");
// console.log(date);

// var test={};
// if(test.id)
// {
//  console.log('exits');

// }
// else{
//     console.log('not exits');
// }

var moment = require('moment');
var now = new Date();
//let date = '12.01.2016 5:10:59'; //12 January 2016



let parsedDate = moment((now.getDate()), 'DD-MM-YYYY H:mm:s')

now.setDate(now.getDate() - 2);


console.log(now.toISOString());

// console.log(parsedDate.toISOString());

//2018-08-16T13:10:57Z
//2018-08-16T15:45:05.610Z