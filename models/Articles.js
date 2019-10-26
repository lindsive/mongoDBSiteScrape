const mongoose = require("mongoose");

// refers to the Schema constructor
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;