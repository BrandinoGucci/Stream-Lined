const{ObjectID} = require('mongodb');


let stored;
exports.videoCollection = (db) =>{
    stored = db.collection('data');
}
exports.find = () => stored.find().toArray();

exports.findById = id => stored.findOne({_id: ObjectID(id)});

exports.save = (video) =>  stored.insertOne(video);

exports.updateById = (id, newvideo) => stored.findOneAndUpdate({_id: ObjectID(id)}, {$set: {title: newvideo.title, content: newvideo.content}});
    
exports.deleteById = id => stored.deleteOne({_id: ObjectID(id)});
//==================================================================================================================================================