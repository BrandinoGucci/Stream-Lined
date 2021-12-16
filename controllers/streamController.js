const model = require('../models/stream');
const request = require("request");
const async = require("async");
var accessToken = '';


exports.index = (req, res, next)=>{
    model.find()
    .then(streams=>res.render('./stream/index', {streams}))
    .catch(err=>next(err));
};

exports.multiviewer = (req, res, next)=>{
  model.find()
  .then(streams=>{
      console.log(streams);
      if(streams) {
            res.render('./stream/multiView', {streams});
      } else {
          let err = new Error('Cannot find a streams');
          err.status = 404;
          next(err);
      }
  })
  .catch(err => next(err));
};

exports.new = (req, res)=>{
    res.render('./stream/new');
};

exports.recommended = (req, res, next)=>{
    //DO NOT CHANGE CLIENT-ID OR CLIENT SECRET, IT'LL MESS EVERYTHING UP
    //Didn't use the promise approach for functions to avoid conflicting with Twitch API practices
    function recommendedStreams(accessToken){
          const topStreams = {
              url: 'https://api.twitch.tv/helix/streams?first=5',//You can change the number after first= to be any number. It determines how many to display on the page
              method: 'GET',
              headers:{
                  'Client-ID': 'fc2fnjxp3z3phrmkc34kduk0cgqmtu',
                  'Authorization': 'Bearer ' + accessToken
              }
          };
          const recommendedStreams = request.get(topStreams,(err,res,body) => {
              if(err){
                  return console.log(err);
              }
              recommended = JSON.parse(body);
          });
    };
    const options = {
        url: 'https://id.twitch.tv/oauth2/token',
        json:true,
        body: {
        client_id: 'fc2fnjxp3z3phrmkc34kduk0cgqmtu',
        client_secret: 'gthpy9zyb3za1bnw37duw09wwesw7x',
        grant_type: 'client_credentials'
        }
    };
  
    request.post(options, (err,res,body)=>{
        if(err){
            return console.log(err);
        };
        recommendedStreams(body.access_token);
    });
  
    //If this timeout isn't here, the twitch api won't update fast enough to work on the first refresh
    setTimeout(() => {
      res.render('./stream/recommended');
    },  1000);
  };

//Starting here, for saved streams
exports.create = (req, res, next)=>{
    let stream = req.body;
    stream.createdAt = new Date();
    stream.display = YTandTWstreams(stream.display);
      model.save(stream)
      .then(result=>{
        res.redirect('/streams')
    })
      .catch(err=>next(err));
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(stream=>{
        console.log(stream);
        if(stream) {
              res.render('./stream/show', {stream});
        } else {
            let err = new Error('Cannot find a stream with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
    
   
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(stream=>{
        if(stream) {
            res.render('./stream/edit', {stream});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
    
};

exports.update = (req, res, next)=>{
    let stream = req.body;
    let id = req.params.id;
    model.findById(id)
    .then(stream=>{
        console.log(stream);
        choosePage = "/streams";
    })
    .catch(err => next(err));
    model.updateById(id, stream)
    .then(result=>{
        if(result.lastErrorObject.updatedExisting){
        res.redirect(choosePage+'/'+id);
        }else{
            let err = new Error('Cannot find a stream with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(stream=>{
        console.log(stream);
    })
    .catch(err => next(err));
    model.deleteById(id)
    .then(result=>{
        if(result){
            res.redirect("/streams");
        }else{
            let err = new Error('Unable to delete a stream with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};



//---------------------------------------------- In-House Stream|Lined YT and Twitch Link Processor
function YTandTWstreams(link){
  let str2 = "";
  if(link.includes("yout")){
    if(link.includes("/channel/")){//starting here, processes youtube channel links (for youtube livestreams only!)
      link = link.split("");
      for(let i=link.length; i>0; i--){
        if(link[i] !== '/'){
          if(link[i] !== undefined){
              str2 = str2+link[i];
            }
          }else{
              break;
          }
      }
      //console.log(str2);
      str2 = str2.split("").reverse().join("");
      str2 = "https://www.youtube.com/embed/live_stream?channel="+str2;
      return str2;
    }
  } if(link.includes("twit")){
      link = link.split("");
      for(let i=link.length; i>0; i--){
        if(link[i] !== '/'){
          if(link[i] !== undefined){
              str2 = str2+link[i];
            }
          }else{
              break;
          }
      }
      str2 = str2.split("").reverse().join("");
      return str2;
  } else {
    return "link was invalid!";
  }
}