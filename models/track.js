const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var model = mongoose.model

const TrackSchema = new Schema(
    {
        username:{type:String,required:true},
        storedFileName:{type:String,required:true},
        actualFileName:{type:String,required:true},
        songName:{type:String,required:true}
    },{collection:"music-player"}
)

TrackSchema.index({storedFileName:1},{unique:true});

const trackModel = model('Track',TrackSchema);

module.exports = trackModel;