import mongoose from "mongoose"
const Schema = mongoose.Schema;

const icsSchema = new mongoose.Schema({
    villaId : {
        type : Schema.Types.ObjectId,
        ref : "villas",
        required : true,
        // unique : true
    },
    icsContent:{
        type : String
    }
},{
    timestamps: true
});

icsSchema.index({ name: 1 });

module.exports = mongoose.models.ics || mongoose.model('ics', icsSchema);