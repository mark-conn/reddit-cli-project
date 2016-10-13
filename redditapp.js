var inquirer = require('inquirer');
var requestAsJson = require('./request-json.js').requestAsJson;
var redditFunctions = require('./reddit.js');


//inquierer object with array of initial menu options
var mainMenuPromt = {
    type: 'list',
    name: 'direction',
    message: "Where would you like to start?",
    choices: ['Show Homepage', 'Show Subreddits Page', 'Show Homepage Sorted by Category', 'Go to a Subreddit']
};

//inquierer object with array of homepage categories
var homePageCategories = {
    type: 'list',
    name: 'direction',
    message: 'Pick a Category',
    choices: ['hot', 'new', 'rising', 'controversial', 'top', 'gilded', 'wiki', 'promoted', new inquirer.Separator(), 'Go Back', new inquirer.Separator()]
}

//inquirer object with array of subreddits
var subreddits = {
    type: 'list',
    name: 'direction',
    message: 'Pick a Subreddit',
    choices: ["FRONT", "ALL", "RANDOM", "ASKREDDIT", "FUNNY", "PICS", "GIFS",
   "TODAYILEARNED", "VIDEO", "WORLDNEWS", "GAMING", "NEWS", "AWW", "SHOWERTHOUGHTS", "MOVIES",
   "MILDLYINTERESTING", "JOKES", "TELEVISION", "TIFU", "LIFEPROTIPS", "PHOTOSHOPBATTLE", new inquirer.Separator(), 'Go Back', new inquirer.Separator()]
}

var subRedditChoice = {
    type: 'list',
    name: 'direction',
    message: 'Sorted or Popular?',
    choices: ['Sorted', 'Popular', new inquirer.Separator(), 'Go Back']
}


function sortHomePage() {
    inquirer.prompt(homePageCategories).then(function (answer) {
      var homePagePick = answer.direction;
      redditFunctions.getSortedHomepage(homePagePick, function(err, result) {
          if(err) console.log(err, "error picking category");
          else {
                if(homePagePick === 'wiki') console.log(result);
                else {
                var justTitles = [];
                result.forEach(function(item){

                    justTitles.push({ title: item.data.title });
                   
                })
                console.log(justTitles) };
          }
          }
      );
    })
}


function showSubReddits() {
    inquirer.prompt(subRedditChoice).then(function (answer) {
        var subPick = answer.direction;
        if(subPick === 'Sorted') {
            showSubRedditMenu();
        }
        else if(subPick === 'Go Back') {
            firstSelection();   
        
        } else {
            redditFunctions.getSubreddits(function(err, result){
                if(err) console.log(err, "error in getting subreddits");
                else {
                var justTitles = [];
                result.forEach(function(item){

                    justTitles.push({ title: item.data.title });
                   
                });
                console.log(justTitles);
                }
            });
            
        }
    });
    
}

function showSubRedditMenu() {
    
    inquirer.prompt(subreddits).then(function (answer) {
        var subRedditPick = answer.direction;
        if(subRedditPick === 'Go Back') showSubReddits();
        else {
            
        inquirer.prompt(homePageCategories).then(function (nextAnswer) {
            var subRedditCatPick = nextAnswer.direction;
            if(subRedditCatPick === 'Go Back') showSubRedditMenu();
            else {
                
           
            redditFunctions.getSortedSubreddit(subRedditPick, subRedditCatPick, function(err, result) {
                if(err) console.log(err, "error in getting sorted subreddits");
                else {
                    var justTitles = [];
                    result.forEach(function(item) {
                        justTitles.push({title: item.data.title});
                    });
                    
                    console.log(justTitles);
                }
            });
            } 
        });
        }
    });
    
}

function rightToSubreddit() {
    inquirer.prompt(subreddits).then(function (answer) {
        var subRedditPick = answer.direction;
        if(subRedditPick === 'Go Back') firstSelection();
        else {
        redditFunctions.getSubreddit(subRedditPick, function(err, result) {
            if(err) console.log(err, "error going to subreddit");
            else {
                    var justTitles = [];
                    result.forEach(function(item) {
                        justTitles.push({title: item.data.title});
                    });
                    console.log(justTitles);
            }
            
        });
        }
    });
    
}


//initiate this app
function main() {
  console.log('Welcome to Reddit, pick an option!');
  firstSelection();
}


//first menu options, branch off into different possibilities
function firstSelection() {
    inquirer.prompt(mainMenuPromt).then(function (answer) {
          
    if (answer.direction === 'Show Homepage') {
        console.log("going to homepage...");
        redditFunctions.getHomepage(function(err, result){
            if(err) console.log(err, "Error getting homepage");
            else { 
                
                //functionality to filter the object in the callback...
                var justTitles = [];
                result.forEach(function(item){
                    justTitles.push({ title: item.data.title });
                })
                 console.log(justTitles) 
                };
                
        });
    }
    
        else if(answer.direction === 'Show Subreddits Page') {
            console.log("going to the subreddits...");
            showSubReddits();
    }
    
        else if(answer.direction === 'Show Homepage Sorted by Category') {
            console.log("sorting homepage...");
            sortHomePage();
            }
            
        else if(answer.direction === 'Go to a Subreddit') {
            console.log("pick a subreddit");
            rightToSubreddit();
        }
    }
  );
}



main();