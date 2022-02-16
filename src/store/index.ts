import { reactive, provide, inject, InjectionKey } from 'vue'
import { GlobalStateT } from '@/@types'
import states from './states'

export const stateName: InjectionKey<GlobalStateT> = Symbol('GLOBAL_STATE')
export const createState = () => reactive({ ...states })
export const useState = () => inject(stateName)
export const provideState = () => provide(stateName, createState())
