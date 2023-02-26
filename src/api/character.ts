import AxiosService from "."
import { getCookie } from 'cookies-next'

import { CharacterFormValues } from "../types"

function returnHeader() {
    return {
        authorization: `JOJO ${getCookie('token')}`
    }
}

export async function registerCharacter(data: CharacterFormValues) {
    const response = await AxiosService.post('/character', data, { headers: returnHeader() })
    return response.data
}

export async function deleteCharacter(id: String) {
    const response = await AxiosService.delete(`/character?id=${id}`, { headers: returnHeader() })
    return response.data
}

export async function getCharacter(id: String = "") {
    const response = await AxiosService.get(`/character${id && `?id=${id}`}`, { headers: returnHeader() })
    return response.data
}
