
module.exports = {
  getKey: getKey
, getRandom: getRandom
, times: times
, isNum: isNum
, extend: extend
//
, createStudents: createStudents
, getRandomFriends: getRandomFriends
, scoreRooms: scoreRooms
, k_combinations: k_combinations
};


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

function extend(a, b){
  for(var i in b) a[i] = b[i];
  return a
}



// TESTING & Data Gen FUNCTIONS

function createStudents(student_count){
  return times(student_count).map(function(n, i){ // create students
    return { 
      id: i
    , friends: getRandomFriends(i, student_count) // random friends
    , room: null // assigned room
  } })
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