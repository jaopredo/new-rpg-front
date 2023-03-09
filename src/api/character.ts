import AxiosService from "."

import { CharacterFormValues } from "../types"

import { returnAuthHeader } from "src/func"

export async function registerCharacter(data: CharacterFormValues) {
    const response = await AxiosService.post('/character', data, { headers: returnAuthHeader() })
    return response.data
}

export async function deleteCharacter(id: String) {
    const response = await AxiosService.delete(`/character?id=${id}`, { headers: returnAuthHeader() })
    return response.data
}

export async function getCharacter(id: String = "") {
    const response = await AxiosService.get(`/character${id && `?id=${id}`}`, { headers: returnAuthHeader() })
    return response.data
}


export async function levelUp(id: String, obj: Object) {
    const response = await AxiosService.patch(`/character/levelUp?id=${id}`, obj, { headers: returnAuthHeader() })
    return response.data
}


export async function saveXP(id: String, value: Number) {
    const response = await AxiosService.patch(`/character/saveXP?id=${id}`, { actualXP: value }, { headers: returnAuthHeader() })
    return response.data
}
export async function saveMentalEnergy(id: String, value: Number) {
    const response = await AxiosService.patch(`/character/mentalEnergy?id=${id}`, { mentalEnergy: value }, { headers: returnAuthHeader() })
    return response.data
}
export async function saveLife(id: String, value: Number) {
    const response = await AxiosService.patch(`/character/life?id=${id}`, { life: value }, { headers: returnAuthHeader() })
    return response.data
}
