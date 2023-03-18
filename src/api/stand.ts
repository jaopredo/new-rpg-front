import AxiosService from "."

import { returnAuthHeader } from 'src/func'


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

export async function updateStandImage(standId: String, img: String) {
    const response = await AxiosService.patch(`/stand/image?standId=${standId}`, { img }, { headers: returnAuthHeader() })
    return response.data
}
export async function updateSubstandImage(substandId: String, img: String) {
    const response = await AxiosService.patch(`/substand/image?substandId=${substandId}`, { img }, { headers: returnAuthHeader() })
    return response.data
}
