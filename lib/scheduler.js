var util = require('./util')

module.exports = Scheduler


function Scheduler(students, options){
  
  this.options = util.extend({
    rooms: 5
  , max_per_room: 8
  }, options || {})
  
  this.students = students || []
  
  this.rooms = util.times(this.options.rooms).map(function(){ return [] })
  this._roomIdx = 0
  
  this._idx = {}
  this._placed = []
  this.priority = null
  this.deferred = []
  
  this.score() // score friendships
  this.index() // sort and index friendships
  this.compute() // walk the index populating rooms
}

Scheduler.prototype = {
  
  score: function(){
    var self = this
    this.students.forEach(function(student){
      student.friends.forEach(function(friend, idx){
        var friends = [student.id, friend]
          , key = util.getKey(friends); // create a unique id for a relationship
        if(!self._idx[key]) self._idx[key] = 0;
        self._idx[key] +=  (student.friends.length - idx) / student.friends.length // scoring
      });
    });
  },
  
  index: function(){
    var self = this
    // build priority index for easy iteration  
    this.priority = Object.keys(this._idx).sort(function(a, b){
      return self._idx[b] - self._idx[a] // sort by score
    }).map(function(key){
      return key.split('_') // map back to just the friends (of score)
    });
  },
  
  compute: function(){
    var self = this
    
    while(this.priority.length && this._placed.length < this.students.length) this.match();
    
    this.deferred.forEach(function(friends){
      var one = self.students[friends[0]]
        , two = self.students[friends[1]];
    
      if(!util.isNum(one.room)) self.addToRoom(one, two.room)
      if(!util.isNum(two.room)) self.addToRoom(two, one.room)
    })
    
  },
  
  match: function(){
    var room = this.getRoom() // current room
      , friends = this.priority.shift()
      , one = this.students[friends[0]]
      , two = this.students[friends[1]];
    
    if(util.isNum(one.room) ||  util.isNum(two.room)) 
      return this.deferred.push(friends);
    else {
      this.addToRoom(one)
      this.addToRoom(two)
    }
  },
  
  addToRoom: function(student, room_id){
    var room = this.getRoom(room_id)
    student.room = room_id;
    room.push(student.id);
    this._placed.push(student.id);
  },
  
  getRoom: function(id){
    var id = (util.isNum(id)) ? id : this.emptiestRoom() //this._roomIdx
      , room = this.rooms[id];
      
    if(room.length >= this.options.max_per_room){
      id = (id < this.rooms.length - 1) ? id + 1 : 0;
      return this.getRoom(id); 
    }

    return room;
  },
  
  emptiestRoom: function(){
    return this.rooms.map(function(room, i){
      return {r: room, i: i}
    }).sort(function(a, b){
      return a.r.length - b.r.length
    })[0].i;
  }

}