//Parse data from JSON POST and insert into MYSQL

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs')
//import jsonform from './frontend/form';


// Configure MySQL connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'apcog@123',
	database: 'event_scheduler'
  })

//Establish MySQL connection
connection.connect(function(err) 
{
   if (err) 
      throw err
   else {
       console.log('Connected to MySQL');
       // Start the app when connection is ready
 }
});

//Read data from file
fs.readFile('./event.json','utf-8',(err,jsonString)=>
{
    if(err)
    {
        console.log("Error");
    }
   
else
{
    console.log(jsonString);


    const jsondata = JSON.parse(jsonString);
    var values = [];

    for(var i=0; i< jsondata.length; i++)
    values.push([jsondata[i].event_id,jsondata[i].trigger_id,jsondata[i].personnel_id,jsondata[i].location_id,jsondata[i].participant_id,jsondata[i].info_id,jsondata[i].schedule_id,jsondata[i].mis_id,jsondata[i].other_resources,jsondata[i].attachments]);
    
    var sql = "INSERT INTO event_master (event_id,trigger_id, personnel_id,location_id,participant_id,info_id,schedule_id,mis_id,other_resources,attachments) VALUES ?";

    //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query(sql, [values], function (err, result) 
    {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
}
});


