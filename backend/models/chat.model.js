import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        sender: { type: String, required: true},
        receiver: { type: String, required: true},
        text: { type: String, required: true}
    }
);

const conversationSchema = mongoose.Schema(
    {
        users: [{
            type: String,
            required: true
        }],
        messages: [messageSchema]
    }
);


const conversationModel = mongoose.model('Conversation', conversationSchema, 'Conversations');

export default conversationModel;