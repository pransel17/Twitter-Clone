import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({ 

    from:{
        type: mongoose.Schema.Types.ObjectId, //stores the ID of the user
        ref: 'User',
        required: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{ // if anong type of notif
        type: String,
        required: true,
        enum: ['follow', 'like']
    },
    read:{
        type:Boolean,
        default: false,
    }
     
},{timestamps: true})

const Notification = mongoose.model('Notification', notificationSchema) // <-- format: (<modelName>, <schema>)

export default Notification;