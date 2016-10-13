var requestAsJson = require('./request-json.js').requestAsJson;

/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
  // Load reddit.com/.json and call back with the array of posts
  requestAsJson('https://reddit.com/.json', function(err, res) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
        callback(null, res.data.children); // look at the result and explain why we're returning .data.children
    }
  });
}

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/

function getSortedHomepage(sortingMethod, callback) {
  var trimmedLowerCase = sortingMethod.trim().toLowerCase();
  requestAsJson('https://reddit.com/'+ trimmedLowerCase + '.json' , function(err, res) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
        console.log("sorting homepage by " + sortingMethod)
        callback(null, res.data.children); 
    }
  });
}


/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/

function getSubreddit(subreddit, callback) {
  var trimmedLowerCase = subreddit.trim().toLowerCase();
  requestAsJson('https://reddit.com'+ trimmedLowerCase + '/.json' , function(err, res) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {

        callback(null, res.data.children); 
    }
  });
}

function getSubreddit2(subreddit, callback) {
  var trimmedLowerCase = subreddit.trim().toLowerCase();
  requestAsJson('https://reddit.com/r/'+ trimmedLowerCase + '/.json' , function(err, res) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {

        callback(null, res.data.children); 
    }
  });
}


/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/

function getSortedSubreddit(subreddit, sortingMethod, callback) {


  var trimmedSubReddit = subreddit.trim().toLowerCase();
  var trimmedSortingMethod = sortingMethod.trim().toLowerCase();
  requestAsJson('https://reddit.com/r/' + trimmedSubReddit + '/' + trimmedSortingMethod + '/.json',
    function(err, result) {
      if (err) console.log(err, "error in subreddit sorted");
      else {
        callback(null, result.data.children);
      }
    });
}


/*
This function should "return" all the popular subreddits
*/

function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
  requestAsJson('https://reddit.com/subreddits.json', function(err, result) {
    if(err) console.log(err, "error in get subreddits json function") ;
    else {
      callback(null, result.data.children);
    }
  })
}



// Export the API
module.exports = {
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits,
  getSubreddit: getSubreddit,
  getSubreddit2: getSubreddit2
};
