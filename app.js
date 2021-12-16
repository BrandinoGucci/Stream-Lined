const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const {MongoClient} = require('mongodb');
const streamRoutes = require('./routes/streamRoutes');
const videoRoutes = require('./routes/videoRoutes');
const {streamCollection} = require('./models/stream');
const {videoCollection} = require('./models/video');
const app = express();


let port = 443;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

MongoClient.connect(url, { useUnifiedTopology: true })
.then((client => {
    dbVid = client.db('storage');
    dbStream = client.db('storage');
    videoCollection(dbVid);
    streamCollection(dbStream);
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
        });
}))
.catch(err=>console.log(err.message));

app.get('/', (req, res)=>{
    res.render('index');
});

app.use('/videos', videoRoutes);
app.use('/streams', streamRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});
//document.getElementsByClassName("ytp-error-content-wrap-reason").innerHTML = "This channel is not online";
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

