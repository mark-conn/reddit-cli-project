var request = require('request');

function requestAsJson(url, cb) {
    request(url, function(err, input) {
        if(err) cb(err); 
        else {
                try {
                    cb(null, JSON.parse(input.body))
                }
                catch(error) {
                    console.log(error,"error is here")
                    cb(error);
                }
             }
    });
}

exports.requestAsJson = requestAsJson;