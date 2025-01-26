import { defineStore } from 'pinia'

export const useSharedFunctions = defineStore('sharedFunctions', {
  state: () => ({
    brother1Function: null,
    brother2Function: null,
  }),
})
