import mongoose, {Schema , model} from 'mongoose';


const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'name is required'],
        minlength: 3,
        maxlength: 25,
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true,'email already exists'],
        // match: [/\S+@\S+\.\S+/, 'Invalid email address'],
      },
      password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6,
        maxlength: 100
      },
      role:{
        type: String,
        enum:['user', 'admin'],
        default:'user'
      }
      ,
      gender:{
        type: String,
        enum:['male', 'female'],
        default:'male'
      },
      DOB:Date,
      phone:String,
      image:String,
      confirmEmail:{
        type:Boolean,
        default:false
      }
    },
    { timestamps: true } 
  );

const User=mongoose.models.User ||model('User' , userSchema);



export default User;