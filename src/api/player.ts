import { PlayerFormValues } from "@/types/"
import AxiosInstance from "./instance"

export async function registerPlayer(data: PlayerFormValues) {
    const response = await AxiosInstance.post('/player/register', data)
    return response.data
}

export async function loginPlayer(data: PlayerFormValues) {
    const response = await AxiosInstance.post('/player/login', data)
    return response.data
}
