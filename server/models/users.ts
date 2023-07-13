import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    imageUrl: string;
    public_id: string;
}

const UserSchema: Schema = new Schema ({ 
        name:{
            type:String,
            required:true,
        },
        surname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:false
        },
        password:{
            type:String,
            required:false
        },
        imageUrl: {
            type: String,
            required:true
        }
        ,
        public_id: {
            type: String,
            required: true
        }
})

const UserModel = mongoose.model<User>('usertable', UserSchema);

export default UserModel;
