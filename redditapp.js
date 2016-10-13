var inquirer = require('inquirer');
var requestAsJson = require('./request-json.js').requestAsJson;
var redditFunctions = require('./reddit.js');
var colour = require('colour');
const imageToAscii = require("image-to-ascii");


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
    choices: ['hot', 'new', 'rising', 'controversial', 'top', 'gilded', 'wiki', 'ads', new inquirer.Separator(), 'Go Back', new inquirer.Separator()]
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


function displayPosts(result) {
var post = [];
post.push(new inquirer.Separator(), "Go Back", new inquirer.Separator());
                    
                    result.forEach(function(item) {
                        post.push(
                            {
                             name: item.data.title,
                             value: {
                                 title: item.data.title,
                                 url: item.data.url,
                                 author: item.data.author

                             } }
                            )
                    });
                    
                    var postSelector = {
                        type: 'list',
                        name: 'direction',
                        message: 'Pick a Post',
                        choices: post
                    };
                    
                    var goHome = {
                        type: 'list',
                        name: 'direction',
                        message: 'Back to main menu?',
                        choices: ['Yes', 'No']
                    };

                    inquirer.prompt(postSelector).then(function(answer){
                        var postPick = answer.direction;
                        if(postPick === 'Go Back') firstSelection();
                        else {
                        
                        var imageCli = imageToAscii(postPick.url, (err, converted) => {
                            console.log(err || converted);
                        });  
                        console.log('\033[2J');    
                        console.log(postPick.title);
                        console.log(postPick.url.blue.underline);
                        console.log(postPick.author.red);
                        console.log(imageCli);
                        }
                        inquirer.prompt(goHome).then(function(answer){
                            var selection = answer.direction;
                            if(selection === 'Yes') firstSelection();
                            else {};
                        })
                    })
                    
}


function sortHomePage() {
    inquirer.prompt(homePageCategories).then(function (answer) {
      var homePagePick = answer.direction;
      if(homePagePick === 'Go Back') firstSelection();
      else {
      redditFunctions.getSortedHomepage(homePagePick, function(err, result) {
          if(err) console.log(err, "error picking category");
          else {
                if(homePagePick === 'wiki') console.log(result);
                else {
                displayPosts(result);
                };
          }
          }
      );
      }
    })
}

function displayPostsSpecial(result) {
    var post = [];
    post.push(new inquirer.Separator(), "Go Back", new inquirer.Separator());
                    
                    result.forEach(function(item) {
                        post.push(
                            {
                             name: item.data.title,
                             value: {
                                 title: item.data.title,
                                 url: item.data.url,
                                 author: item.data.author

                             } }
                            )
                    });
                    
                    var postSelector = {
                        type: 'list',
                        name: 'direction',
                        message: 'Pick a Post',
                        choices: post
                    };
                    
                    var goHome = {
                        type: 'list',
                        name: 'direction',
                        message: 'Back to main menu?',
                        choices: ['Yes', 'No']
                    };

                    inquirer.prompt(postSelector).then(function(answer){
                        var postPick = answer.direction;
                        if(postPick === 'Go Back') firstSelection();
                        else {
                            // console.log(postPick)
                            redditFunctions.getSubreddit(postPick.url, function(err, result){
                                if(err) console.log(err, "latest damn error");
                                else {
                                  displayPosts(result);  
                                    
                                }
                            });
                        }
                        inquirer.prompt(goHome).then(function(answer){
                            var selection = answer.direction;
                            if(selection === 'Yes') firstSelection();
                            else {};
                        })
                    })
                    
}


function sortHomePage() {
    inquirer.prompt(homePageCategories).then(function (answer) {
      var homePagePick = answer.direction;
      if(homePagePick === 'Go Back') firstSelection();
      else {
      redditFunctions.getSortedHomepage(homePagePick, function(err, result) {
          if(err) console.log(err, "error picking category");
          else {
                if(homePagePick === 'wiki') console.log(result);
                else {
                displayPosts(result);
                };
          }
          }
      );
      }
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
                    displayPostsSpecial(result);
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
                    displayPosts(result);
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
        redditFunctions.getSubreddit2(subRedditPick, function(err, result) {
            if(err) console.log(err, "error going to subreddit");
            else {
                    // console.log(result);
                displayPosts(result);
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
                    displayPosts(result);
                }
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