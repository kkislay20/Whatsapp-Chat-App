import express from 'express'
import getMsgsOfConversation from '../controllers/messages.controller.js';

const router = express.Router();

// define the about route
router.get("/", getMsgsOfConversation);

export default router;