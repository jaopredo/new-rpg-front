import AxiosService from "."

import { returnAuthHeader } from 'src/func'

import { StandFormValues } from "@/types/stand"

export async function registerStand(data: Object) {
    const response = await AxiosService.post('/stand', data, { headers: returnAuthHeader() })
    return response.data
}
export async function registerSubstand(data: Object) {
    const response = await AxiosService.post('/substand', data, { headers: returnAuthHeader() })
    return response.data
}


export async function getStand(charId: String) {
    const response = await AxiosService.get(`/stand?charId=${charId}`, { headers: returnAuthHeader() })
    return response.data
}
export async function getSubstand(charId: String) {
    const response = await AxiosService.get(`/substand?charId=${charId}`, { headers: returnAuthHeader() })
    return response.data
}