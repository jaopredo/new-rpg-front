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
