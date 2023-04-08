import mongoose, { trusted } from "mongoose";

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    originalName:{
        type: String,
        required: true
    },
    password: String,
    downloadCount:{
        type: Number,
        required: true,
        default: 0
    }

})
const File = mongoose.model("file", fileSchema);
export default File;
// module.exports=mongoose.model("file", File)