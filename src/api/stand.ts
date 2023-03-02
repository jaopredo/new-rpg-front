import AxiosService from "."

import { StandFormValues } from "@/types/"

export async function registerStand(data: Object) {
    const response = await AxiosService.post('/stand', data)
    return response.data
}
export async function registerSubstand(data: Object) {
    const response = await AxiosService.post('/substand', data)
    return response.data
}
