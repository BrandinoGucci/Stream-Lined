const model = require('../models/video');
const request = require("request");
const async = require("async");
var accessToken = '';

exports.index = (req, res, next)=>{
    model.find()
    .then(videos=>res.render('./video/index', {videos}))
    .catch(err=>next(err));
    
};

exports.new = (req, res)=>{
    res.render('./video/new');
};

//Starting here, for saved clips and videos
exports.create = (req, res, next)=>{
    let video = req.body;
    video.createdAt = new Date();
    video.display = URLtoShow(video.display);
    model.save(video)
    .then(result=>{
      res.redirect('/videos')
  })
    .catch(err=>next(err));
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(video=>{
        console.log(video);
        if(video) {
          res.render('./video/show', {video}); 
        } else {
            let err = new Error('Cannot find a video with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
    
   
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(video=>{
        if(video) {
            res.render('./video/edit', {video});
        } else {
            let err = new Error('Cannot find a video with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
    
};

exports.update = (req, res, next)=>{
    let video = req.body;
    let id = req.params.id;
    model.findById(id)
    .then(video=>{
        console.log(video);
            choosePage = "/videos";
    })
    .catch(err => next(err));
    model.updateById(id, video)
    .then(result=>{
        if(result.lastErrorObject.updatedExisting){
        res.redirect(choosePage+'/'+id);
        }else{
            let err = new Error('Cannot find a video with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(video=>{
        console.log(video);
    })
    .catch(err => next(err));
    model.deleteById(id)
    .then(result=>{
        if(result){
            res.redirect("/videos");
        }else{
            let err = new Error('Unable to delete a video with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};



//---------------------------------------------- In-House Stream|Lined YT and Twitch Link Processor
function URLtoShow(link){
  let str2 = "";
  if(link.includes("/channel/") || link.includes("/c/")){//starting here, processes youtube channel links (for youtube livestreams only!)
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
  if(link.includes("yout")){//starting here, processes youtube video links 
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
    str2 = str2.split("").reverse();
    if(str2.includes("=")||str2.includes("&")){
      for(let i =0; i<str2.length; i++){
        if(str2[i] !== '='){
          str2[i] = undefined;
        }else{
          str2[i] = undefined;
          break;
        }
      }
     str2 = str2.reverse();
     if(str2.includes("&")){
        for(let i =0; i<str2.length; i++){
          if(str2[i] !== '&'){
            str2[i] = undefined;
          }else{
            str2[i] = undefined;
            break;
          }
        }
      }
      str2 = str2.reverse();
      let str3 = "";
      for(let i=0;i<str2.length; i++){
        if(str2[i]!==undefined){
          str3 = str3+str2[i];
        }
      }
      str2 = str3;
      str2 = "https://www.youtube.com/embed/"+str2;
    }else{
      str2 = str2.join("");
      str2 = "https://www.youtube.com/embed/"+str2;
    }
  }else{ //starting here, processes video twitch links
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
      if(link.join("").includes('clip')) {
      str2 = 'https://clips.twitch.tv/embed?clip='+str2+'&parent=localhost';
    } else {
      str2 = 'https://player.twitch.tv/?video='+str2+'&parent=localhost';
    }
    return str2;
  }
    return str2;
  }