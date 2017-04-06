# TrainingServer
Server repository for Zreyas training programme

1. Pub/Sub for waiting time :

SUBSCRIBE channel : 'wait_time_req' 
MESSAGE format    : {"Requester": "APP","parking_lot_id":"zreyas_b8:27:eb:3a:fb:c5","Timestamp": "2017-03-09 15:40:00","Userid":"asdfj-3r687236-3jka-323"}


PUBLISH channel   : 'wait_time_resp'
MESSAGE format    : {"Requester": "Analytics","parking_lot_id":"zreyas_b8:27:eb:3a:fb:c5","Userid":"asdfj-3r687236-3jka-323","parking_id" : "4" , "wait_time" : "2"}

   'wait_time' is in minutes.
