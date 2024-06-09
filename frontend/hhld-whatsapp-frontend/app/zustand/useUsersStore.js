import { create } from 'zustand'

export const useUsersStore = create((set) => ({
  'users': [],
  'setUsers': (users) => set({users: users}),
  'receiver': '',
  'setReceiver': (user) => set({receiver: user})
}));