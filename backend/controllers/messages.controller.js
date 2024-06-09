import { get } from "http";
import conversationModel from "../models/chat.model.js";

export const addMsgToConversation = async(participants, message) => {
    try{
        // Find conversation by participants
        let conversation = await conversationModel.findOne({
            "users": { $all : participants }
        });

        if(!conversation) {
            conversation = await conversationModel.create({users: participants});
        }

        conversation.messages.push(message);
        await conversation.save();
    } catch(error) {
        console.log('Error adding message to conversation: ' + error.message);
    }
}

// Get messages for a conversation identified by participants
const getMsgsOfConversation = async(req, res) => {
    try{
        const {sender, receiver} = req;
        const participants = [sender, receiver];

        const conversation = await conversationModel.findOne({
            "users": { $all : participants }
        });

        if(!conversation) {
            console.log('Conversation not found');
            return res.status(200).send();
        } 
        return res.json(conversation.msgs);
    } catch(error) {
        console.log('Error fetchings conversation messages: ' + error.message);
        res.status(500).json({ error: 'Server error' });
    }
}



export default getMsgsOfConversation;