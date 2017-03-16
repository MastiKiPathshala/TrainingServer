# TrainingServer
Server repository for Zreyas training programme

1. Pub/Sub for waiting time :

SUBSCRIBE channel : 'wait_time_req' 
MESSAGE format    : {"timestamp" : "2017-03-09 15:40:00" }


PUBLISH channel   : 'wait_time_resp'
MESSAGE format    : {"parking_id" : "4" , "wait_time" : "2"}

   'wait_time' is in minutes.
