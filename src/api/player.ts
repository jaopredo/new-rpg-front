import { PlayerFormValues } from "@/types/player"
import AxiosService from "."
import { returnAuthHeader } from "../func"

export async function registerPlayer(data: PlayerFormValues) {
    const response = await AxiosService.post('/player/register', data)
    return response.data
}

export async function loginPlayer(data: PlayerFormValues) {
    const response = await AxiosService.post('/player/login', data)
    return response.data
}

export async function getPlayerName() {
    const response = await AxiosService.get('/player/name', { headers: returnAuthHeader() })
    return response.data
}
