import mongoose, {schema} from 'mongoose';

const tweetSchema = new schema({
    content: {
        type: String,
        required: true,
        maxlength: 200
    },
   owner: {
    type: schema.ObjectId,
    ref: "User",
    required: true
   }      
},{timestamps: true})

export const Tweet = mongoose.model("Tweet", tweetSchema);