import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
             lowercase: true,
            trim: true,
            index: true, // help to keep searchable 
        },
         email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
           
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        fullName: {
            type:String,
            required: true,
            trim: true,
            index: true, 
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
               type: Schema.Types.ObjectId,
               ref: "Video",

        }
    ],
    refreshString: {
        type: String,
    }


},
{
    timestamps: true,
}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genrateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },  
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.genrateRefreshToken = function(){
    JsonWebTokenError.sign(
        {
            _id: this._id,
        },  
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);