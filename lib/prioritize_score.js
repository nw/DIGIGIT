
var start = Date.now();

//times(1000).forEach(function(){
  var boys = gen(31, 5);
  //console.log(scoreRooms(boys.rooms, boys.scoring_index), boys.rooms);
//});
console.log("time", (Date.now() - start) / 1000)


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
    , priority; // cleaned up data structure to walk

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
  
  // while we have rooms and priority scoring lets populate
  while(current_room_idx < rooms.length && priority.length) populateRoom();
  // if this matches then we have unlucky students (sanity checker)
  if(accounted_for.length < student_count) handleRemainingStudents();


  return {
    rooms: rooms
  , students: students
  , scoring_index: scoring_index }


  //
  //  Scoped function below
  //
  
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
  
  function handleRemainingStudents(){
    current_room_idx = rooms.length - 1;
    students.forEach(function(student){
      if(!isNum(student.room)) addToRoom(student.id)
    })
  }

  
  function addToRoom(student_id){
    var student = students[student_id];
    if(!isNum(student.room)){
      student.room = current_room_idx
      rooms[current_room_idx].push(student_id)
      accounted_for.push(student_id)
    }
  }
  
}


function getRandomFriends(person, total){
  var friends = []
    , total_friends = 4
    , i = 0;
  while(i < total_friends ){
    var f = getRandom(total);
    if(f !== person && friends.indexOf(f) == -1){
      var score = 1 / (i++ + 1);
      friends.push(f)
    }
  }
  return friends;
}

function getKey(friends){
  return friends.sort().join('_');
}

function getRandom(num){
  return Math.floor(Math.random()* num);
}

function times(num){
  return Array.apply(null, new Array(num))
}

function isNum(num){
  return typeof num === 'number'
}


// TESTING FUNCTIONS


function scoreRooms(rooms, scoring_index){
  return rooms.map(function(room){
    return k_combinations(room, 2).reduce(function(score, friends){
      return score += scoring_index[getKey(friends)] || 0;
    }, 0)
  })
}


// https://gist.github.com/axelpale/3118596

function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;
  
  if (k > set.length || k <= 0) {
    return [];
  }
  
  if (k == set.length) {
    return [set];
  }
  
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }
  
  // Assert {1 < k < set.length}
  
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i+1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}