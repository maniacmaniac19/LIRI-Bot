function main(){require('dotenv').config();
const fs = require('fs')
const Spotify = require('node-spotify-api')
const request = require('request')
const keys = require('./keys')
const spotify = new Spotify(keys.spotify);
const omdbkey = keys.omdb.api;
const bitkey = keys.bandsintown.api;

//switch statement for the options. 
let action = process.argv[2]
let media = ''

for (i = 3; i < process.argv.length; i++){
    if(i === 3){
        media += process.argv[i]
        }
        else{
        media += " " + process.argv[i]
        }
    }

    let act = function(action){
        switch(action){
            case "concert-this":
            concert();
            break;
            case "spotify-song":
            song();
            break;
            case "movie-this":
            movie();
            break;
            case "do-what-it-says":
            dowhat();
            break;
        }
         }

let concert = function(){
    request(`https://rest.bandsintown.com/artists/${media}/events?app_id=${bitkey}`, function(err, res, body){
        if (err) {
            return console.log('Error occurred: ' + err);
          }
        // console.log(res)
        // for(i = 0; i < res.eventdata.length; i++){
            let data = JSON.parse(body);
            for(i=0;i<data.length; i++){

                console.log('\nVenue:\n' + data[i].venue.name)
                console.log(data[i].venue.city + ', ' + data[i].venue.region)
            }
        
    })
    

};

let song = function(){
    if(media === ""){media = "What's my age again"}
    spotify.search({
        type: 'track',
        query: media
      },
      function(err, data) {
        if (err) {
          console.log('Error occurred: ', err);
          return;
        }
        for(i = 0; i < data.tracks.items.length; i++){
            // console.log(data.tracks.items[i])
            console.log("\nArtist Name: " + data.tracks.items[i].artists[0].name);
            console.log("Song Name: " + data.tracks.items[i].name);
            console.log("Click here to listen: " + data.tracks.items[i].external_urls.spotify)
            console.log("Album Name: " + data.tracks.items[i].album.name)	
        }
        })
  
    
    
};

let movie = function(){
    if(media === ''){media = 'Mr. Nobody'}
    request(`http://www.omdbapi.com/?apikey=${omdbkey}&t=${media}` , function(err,response, body){
        console.log(err);
        // console.log(media)
        

        let data = JSON.parse(body);
        console.log('Movie Title: ' + data.Title + '\nYear: ' + data.Year + '\nIMDB Rating: ' + data.Ratings[0].Value + '\nRotten Tomatoes Rating: ' + data.Ratings[1].Value + '\nCountry: ' + data.Country + '\nLanguage: ' + data.Language + '\nPlot: ' + data.Plot + '\nActors: ' + data.Actors)
    
        
        
        
    })    
        
};
        
    


let dowhat = function(){
    fs.readFile('./random.txt', 'utf8', function(err,data){
        console.log(data)
         str = data.split(",")
         console.log(str)
         media = str[1];
         console.log(media);
         console.log(str[0])
        act(str[0]);
    })
};

 act(action)}

 main();