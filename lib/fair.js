
var start = Date.now();

//times(1000).forEach(function(){
  var boys = gen(31, 5);
  console.log(boys.rooms);
  console.log('--------------------');
  console.log(scoreRooms(boys.rooms, boys.scoring_index));
  
  
// });
// console.log("time", (Date.now() - start) / 1000)


function gen(student_count, rooms){
  
  var rooms = times(rooms).map(function(){ return [] }) // init rooms
    , current_room_idx = 0 // starting room
    , students = times(student_count).map(function(n, i){ // create students
        return { 
          id: i
        , friends: getRandomFriends(i, student_count) // random friends
        , room: null // assigned room
      } })
    , scoring_index = {} // use this to prioritize by best friend matches
    , accounted_for = [] // sanity checker
    , priority // cleaned up data structure to walk
    , deferred = [];

  // score friends  
  students.forEach(function(student){
    student.friends.forEach(function(friend, idx){
      var friends = [student.id, friend]
        , key = getKey(friends); // create a unique id for a relationship
      if(!scoring_index[key]) scoring_index[key] = 0;
      scoring_index[key] +=  (student.friends.length - idx) / student.friends.length // scoring
    });
  });
  
  // build priority index for easy iteration  
  priority = Object.keys(scoring_index).sort(function(a, b){
    return scoring_index[b] - scoring_index[a] // sort by score
  }).map(function(key){
    return key.split('_') // map back to just the friends (of score)
  });
  

  while(priority.length && accounted_for.length < student_count) next_match();

  deferred.forEach(function(friends){
    var one = students[friends[0]]
      , two = students[friends[1]];
    
    if(!isNum(one.room)) addToRoom(one, two.room)
    if(!isNum(two.room)) addToRoom(two, one.room)
  })

  return {
    rooms: rooms
  , students: students
  , scoring_index: scoring_index }


  //
  //  Scoped function below
  //
  
  function next_match(){
    var room = getRoom() // current room
      , friends = priority.shift()
      , one = students[friends[0]]
      , two = students[friends[1]];
    
    if(isNum(one.room) ||  isNum(two.room)) return deferred.push(friends);
    else {
      addToRoom(one, current_room_idx)
      addToRoom(two, current_room_idx)
    }
  }
  
  function addToRoom(student, room_id){
    var room = getRoom(room_id)
    student.room = room_id;
    room.push(student.id);
    accounted_for.push(student.id);
  }
  
  
  function getRoom(id){
    var id = (isNum(id)) ? id : current_room_idx
      , room = rooms[id];
    if(room.length >= 8){
      id = (id < rooms.length-1) ? id + 1 : 0;
      return getRoom(id); 
    }
    return room;
  }
  
  
  function populateRoom(){
    var room = rooms[current_room_idx] // current room
      , friends = priority.shift().forEach(function(id){ addToRoom(id); });
    
    priority = priority.filter(function(friends){ 
      return !friends.some(function(friend, idx){ // kinda abusive (!) not obvious
        if(!!~room.indexOf(friend)){
          if(room.length < 8) addToRoom(friends[(idx) ? 0 : 1]);
          return true
        }
      })
    })
  
    current_room_idx++;
  }
  
}
