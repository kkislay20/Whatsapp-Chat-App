import {create} from 'zustand';

export const usechatReceiverStore = create( (set) => ({
   chatReceiver: '',
   updateChatReceiver: (chatReceiver) => set({chatReceiver})
}));