import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  'authName': '',
  'setAuthName': (name) => set({authName: name})
}))