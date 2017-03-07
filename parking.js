// parking.js
var async = require('async');
var redis = require('redis');

//var r1     = redis.create();
//var r2     = redis.createClient();
var client = redis.createClient();
var index,median;

//arrays storing coming-in time. length of subarrays= no. of parking lots
var mon = [];
var tue = [];
var wed = [];
var thu = [];
var fri = [];
var sat = [];
var sun = [];

const LOTS          = 1; //total parking lots
const PARKING_SLOTS = 50; // slots per parking lot
const TIME_SLOTS    = 12;  // 2hr time slots for 24hrs
const INTERVAL      = 31*24*60* 60 *1000;  //for ltrim of medians
const AVG_CARS_PM   = 500 *30 ; //per month per lot?

initialize_arrays(mon);
initialize_arrays(tue);
initialize_arrays(wed);
initialize_arrays(thu);
initialize_arrays(fri);
initialize_arrays(sat);
initialize_arrays(sun);

// since interval for a month causes overflow
function setTimeout_ (fn, delay) {
    var maxDelay = Math.pow(2,31)-1;

    if (delay > maxDelay) {
        var args = arguments;
        args[1] -= maxDelay;

        return setTimeout(function () {
            setTimeout_.apply(undefined, args);
        }, maxDelay);
    }

    return setTimeout.apply(undefined, arguments);
}

function initialize_arrays(arr)
{
  for(var i=0;i<TIME_SLOTS;i++)
 {  arr[i]=[];
    for(var j=0;j<LOTS;j++)
      arr[i][j]=[];
  }
}


/*r1.on("subscribe", function(channel, count) {
    console.log("Subscribed to " + channel );
});

r1.subscribe("parking");

r2.publish("parking",JSON.stringify({"lot": 1,"id":5,"status":1,"day" :"Monday","time" :"0.5"}));

setInterval(function()
{r2.publish("parking",JSON.stringify({"lot": 1,"id":5,"status":1,"day" :"Monday","time" :"1.5"}));
r2.publish("parking",JSON.stringify({"lot": 2,"id":4,"status":0,"day" :"Monday","time" :"3.5"}));
r2.publish("parking",JSON.stringify({"lot": 1,"id":2,"status":1,"day" :"Monday","time" :"3"}));
}, 12000);

setInterval(function()
{r2.publish("parking",JSON.stringify({"lot": 1,"id":5,"status":0,"day" :"Monday","time" :"2"}));
r2.publish("parking",JSON.stringify({"lot": 2,"id":4,"status":1,"day" :"Monday","time" :"3"}));
r2.publish("parking",JSON.stringify({"lot": 2,"id":2,"status":1,"day" :"Monday","time" :"2"}));

}, 11000);
*/
var mqtt = require('mqtt');
  
var options = {
  port :1883,
  keepalive: 60,
  username: 'root',
  password: 'ksM9gH5hxhkb'
};
var r1 = mqtt.connect('mqtt://162.242.215.7',options)


r1.on('connect', function() { 
  console.log("Mqtt connected") 
  r1.subscribe('parkingstatus-req',function(){
  r1.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
});

})

  r1.on("message", function(channel, message) 
  { console.log("Message" +message);
  var obj=JSON.parse(message);
  console.log("Message from channel " + channel + ": LOT : " +obj.lot+" id: " +obj.id + " status:  " +obj.status+" day: " +obj.day +" time : "+obj.time );

  var lot=obj.lot;
  var id=obj.id;
  var status=obj.status;
  var time=obj.time;
  var day = obj.day;
//client.on('message', function(topic, message) {  
  
  	switch(day){
  	case 'Monday'   : time_division(mon,'mon',sun,'sun',status,time,id,lot);
  					break;
  	case 'Tuesday'  : time_division(tue,'tue',mon,'mon',status,time,id,lot);
  					break;
  	case 'Wednesday': time_division(wed,'wed',tue,'tue',status,time,id,lot);
  					break;
    case 'Thursday' : time_division(thu,'thu',wed,'wed',status,time,id,lot);
  					break;
  	case 'Friday'   : time_division(fri,'fri',thu,'thu',status,time,id,lot);
  					break;
  	case 'Saturday' : time_division(sat,'sat',fri,'fri',status,time,id,lot);
  					break;
  	case 'Sunday'   : time_division(sun,'sun',sat,'sat',status,time,id,lot);
  					break;
  	default 	      : 
            break;
  				}  
  });

function time_division(day,name,prev,prev_name,status,time,id,lot)
  {  
    if (status == 1){
            if(time >= 0 && time <= 2)
            { var key = lot+prev_name +'11';
              calculate_median(key,'med_'+key);
              day[0][lot][id]=time;
              //console.log("DAY "   +day+ "  "+name);
            }
            else if (time>2  && time <= 4)
            { var key = lot+name +'0';
              calculate_median(key,'med_'+key);
              earliest_time(day,'mon',time,lot);  //calculating earliest & wait time
              //console.log("DAY "   +day+ "  "+key);
              day[1][lot][id]=time;
            }
            else if (time>4  && time <= 6)
            { var key = lot+day +'1';
              calculate_median(key,'med_'+key);
              day[2][lot][id]=time;
            }
            else if (time>6  && time <= 8)
            {var key = lot+day +'2';
              calculate_median(key,'med_'+key);
              day[3][lot][id]=time;
            }
            else if (time>8  && time <= 10)
            { var key = lot+day +'3';
              calculate_median(key,'med_'+key);
              day[4][lot][id]=time;
            }
            else if (time>10  && time <= 12)
            { var key = lot+day +'4';
              calculate_median(key,'med_'+key);
              day[5][lot][id]=time;
            }
            else if (time>12  && time <= 14)
              { var key = lot+day +'5';
              calculate_median(key,'med_'+key);
              day[6][lot][id]=time;
            }
            else if (time>14  && time <= 16)
             { var key = lot+day +'6';
              calculate_median(key,'med_'+key);
              day[7][lot][id]=time;
            }
            else if (time>16  && time <= 18)
            { var key = lot+day +'7';
              calculate_median(key,'med_'+key);
              day[8][lot][id]=time;
            }
            else if (time>18  && time <= 20)
              { var key = lot+day +'8';
              calculate_median(key,'med_'+key);
              day[9][lot][id]=time;
            }
            else if (time>20  && time <= 22)
              { var key =lot+ day +'9';
              calculate_median(key,'med_'+key);
              day[10][lot][id]=time;
            }
            else if (time>22  && time <= 24)
              { var key = lot+day +'10';
              calculate_median(key,'med_'+key);
              day[11][lot][id]=time;
            }
          
          }
          else
          { //check for previous day
            for(var j=11;j>=0;j--)
            {
              if(prev[j][lot][id]!=null)
              {
                var key = lot+prev_name+i;
                client.lpush(key,time-prev[j][lot][id], function (err, res) {console.log("REDIS lpush in :  " +key+" : "+res);
                //console.log("Printing array day : " +prev);
                prev[j][lot][id]=null; });
                break;
              }
            
              if(j==0){ //then, check for current day
            for(var i=Math.floor(time/2);i>=0;i--)
            { 
           
              if(day[i][lot][id]!=null)
              {
                var key = lot+name+i;
                client.lpush(key,time-day[i][lot][id], function (err, res) {console.log("REDIS lpush in :  " +key+" : "+res);
                //console.log("Printing array day : " +day);
                day[i][lot][id]=null; });
                break;
              }

              }
            }
          }
  }

function calculate_median (key,list_name) {
  //list_name = med_mon0, med_tue1,etc

      client.sort(key, function(err, reply) {
               if(reply!='') {
                console.log("REeeDIS sorted:  " +reply); 

      client.llen(key, function(err, reply) {
               
               console.log("REeeDIS llen:  " +reply);
               index=Math.floor(reply/2); 
               console.log("REeeDIS index:  " +index);

      client.lindex(key, index,function(err, reply) {
                console.log("REeeDIS lindex:  " +index);
              median = reply;
      if(median!=null)
      client.lpush(list_name,median,function(err,reply){
                console.log("Median of "+key+ " pushed into " +list_name+ ". Value = "+median)
                })
      client.lpush("median",median,function(err,reply){
                console.log("Median of "+key+ " pushed into  list : median. Value = "+median)
                })
    })
    }) 
    }
    })


}
}

function earliest_time(arr,name,time,lot)
{ var i=0;
  var x,array;
  while(i<=11)
  {
    if(arr[i][lot]!=null)
   { 
    async.series([
    function(callback) {
        array=arr;
        callback(null);
    },
    
    function(callback) {
        x=array[i][lot].slice().sort(function(a,b){return a-b;});
        callback(null);
    },
    
    function(callback) {
        var index = arr[i][lot].indexOf(x[0]) ; 
        console.log("Earliest time for LOT: " +lot+ " is : "+x[0]+ "   at parking id : "+index);
        callback(null);
    },

     function(callback) {
      //expected wait time
        var key = "med_"+lot+name+i;
        client.lindex(key,0,function(err,reply)
   {    var wait = parseFloat(reply -time) + parseFloat(x[0]);
        console.log("Expected wait time : " +wait.toFixed(2));
   })
        callback(null);
    }
    ],
  function(err, results) {
  });
    
     break;  
  
  }
  else 
    i++;
}

}


setTimeout(function(){
  client.ltrim("median",0,AVG_CARS_PM,function(err,done){
    if(err) console.log(err)
    else console.log('trimmed list')
  })
}, INTERVAL);















/*function _function1 (key) {
    return function (callback) {
      client.sort(key, function(err, reply) {
                console.log("REeeeDIS sorted:  " +reply); 
                }) 
        var x=5;
        callback (null,x);
   }
}
function _function2 (x,callback) {
    return function (callback) {
     client.llen(key, function(err, reply) {
                console.log("REeeeDIS llen:  " +reply);
               var index=reply/2; 
                })
       callback (err, index);
    }
}
function _function3 (index, callback) {
    return function (callback) {
 client.lindex(key, index,function(err, reply) {
                console.log("REeeDIS lindex:  " +reply);
               var median = reply;
                })
      callback (err,median);
    }
}
function _function4 (median, callback) {
    return function (callback) {
 client.rpush(key,median,function(err,reply){
                console.log("Median of "+key+ " pushed into redis. Value = "+median)
                })


      callback (err,'done');
    }
}*/
    

    
    
   


