import { PlayerFormValues } from "@/types/"
import AxiosService from "."

export async function registerPlayer(data: PlayerFormValues) {
    const response = await AxiosService.post('/player/register', data)
    return response.data
}

export async function loginPlayer(data: PlayerFormValues) {
    const response = await AxiosService.post('/player/login', data)
    return response.data
}
