import mongoose, {Schema} from  "mongoose";
import mongooseAggregstePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const videoSchema = new Schema(
    {
     videoFile:{
        type: String, // cloudinary url
        required: true,
     },
     thumbnail: {
      type: String,
      required: true
     },
     title: {
        type: String,
        required: true,
     }, 
     description: {
        type: String,
        required: true,
        trim: true,
     }    ,
     duration: {
      type: Number,
      required: true,  
     },
       views: {
         type: Number,
         deafault: 0, 
       },
        isPublished: {
         type: Boolean,
         default: true, 
        },
        owner: {
         type: Schema.Types.ObjectId,
         ref:"User",
        },




    },
    { timestamps: true,
 }
)

userSchema.pre("save", async function(next){   // complex process will take time
   if(!this.isModified("password")) return next();

   this.password = bcrypt.hash(this.password, 10)
   next()
})

// to compare password 

userSchema.methods.ispasswordCorrect = async function(password){
return await bcrypt.compare("pasowrd", this.password)
}




videoSchema.plugin(mongooseAggregstePaginate)

export const Video = mongoose.model("video",videoSchema);
