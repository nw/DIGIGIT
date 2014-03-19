var Scheduler = require('..')
  , util = require('../lib/util');
  
  
  [29, 31].forEach(function(students){
    log(new Scheduler(util.createStudents(students)))
  });
  

function log(assignment){
  util.scoreRooms(assignment.rooms, assignment._idx).forEach(function(score, idx){
    console.log("room-"+ idx + " score: " +score, assignment.rooms[idx])
  })
  console.log('------------------------------------')
  
}
