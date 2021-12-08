
var express = require('express');
var mysql = require('mysql');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configure MySQL connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'apcog@123',
	database: 'scheduler'
  })

//Establish MySQL connection
connection.connect(function(err) 
{
   if (err) 
      throw err
   else 
   {
       console.log('Connected to MySQL');
      
   }
});

app.post("/", (req, res, next) => 
{
 
   var jsonstring = JSON.stringify(req.body);
   var parseddata = JSON.parse(jsonstring);
   console.log(parseddata); 
  
    if(parseddata != 0)
   {
   
    // columns to be selected and tables for join condition
    const columns = parseddata.columns;
    const t1 = parseddata.tables.t1;
    const t2 = parseddata.tables.t2;
    const strt = parseddata.mandatory.strt;
    const end = parseddata.mandatory.end; 
    const entity = parseddata.or.entity

    // for where clause conditions
    var condstring = JSON.stringify(parseddata.and);
    var parsedand = JSON.parse(condstring);

    var condstring = JSON.stringify(parseddata.and);
    var parsedor = JSON.parse(condstring);

    console.log(parsedand);
    console.log(parsedor);
    var resultand = [];
    var resultor = [];
  
    for(var i in parsedand)
    resultand.push([i, parsedor[i]]);

    for(var i in parsedor)
    resultor.push([i, parsedor[i]]);

    console.log(resultand)
    console.log(resultor)
    
    let Values1 = Object.values(parsedand);
    console.log(Values1);

    let keys1 = Object.keys(parsedor);
    console.log(keys1);

    let Values2 = Object.values(parsedand);
    console.log(Values2);
    
    let keys2 = Object.keys(parsedor);
    console.log(keys2);

    var condition1="";
    var condition2="";
    for(let i = 0; i < keys1.length; i++)
     {
     
      if(i!=0)
      {
       condition1 += "AND" + " ";
      }
      
      condition1 += keys1[i] + "  " + "=" + " " + Values1 [i] + " ";
     }
     console.log(condition1);
   

     for(let i = 0; i < keys2.length; i++)
     {
     
      if(i!=0)
      {
       condition2 += "OR" + " ";
      }
      
      condition2 += keys2[i] + "  " + "=" + " " + Values2 [i] + " ";
     }
     console.log(condition2);
    
 /*
  
  SELECT startdatetime,enddatetime,p.user_id
  FROM  event_master e,participant_master p
  WHERE  e.event_id = p.event_id AND p.status = 'free' AND startdatetime >= '2021-10-20 08:00' AND enddatetime <= '2021-10-20 12:00' 
  order by startdatetime;

  var query = connection.query('SELECT ?? FROM ?? p join ?? e on p.event_id = e.event_id WHERE ur.actor_id = ? and ur.last_name = ?', [columns, 'actor','film_actor', 
  */
  
  var query = connection.query('SELECT ?? FROM ?? p join ?? e on p.event_id = e.event_id  WHERE startdatetime >= ? AND enddatetime <= ? AND ? OR entity = ?  order by startdatetime', [columns, t1,t2,strt,end,condition1,entity,strt], function (error, results, fields) 
  {
      console.log(query);
      if (error) throw error;
      console.log(results);
  }); 
  
  
}
   else
   console.log("json is empty")
   

});

app.listen(3000, () => {
    console.log('Listening on port: ' + 3000);
});