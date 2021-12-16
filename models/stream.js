const{ObjectID} = require('mongodb');


let stored;
exports.streamCollection = (db) =>{
    stored = db.collection('streams');
}
exports.find = () => stored.find().toArray();

exports.findById = id => stored.findOne({_id: ObjectID(id)});

exports.updateById = (id, newstream) => stored.findOneAndUpdate({_id: ObjectID(id)}, {$set: {title: newstream.title, content: newstream.content}});

exports.save = (stream) =>  stored.insertOne(stream);
    
exports.deleteById = id => stored.deleteOne({_id: ObjectID(id)});
//==================================================================================================================================================