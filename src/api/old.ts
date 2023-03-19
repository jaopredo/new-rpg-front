import axios from "axios"

const AxiosOldApiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_OLD_API_URL,
})


export async function checkOldPlayer(email: String) {
    const response = await AxiosOldApiService.post('/player/check', { email })
    return response.data
}


export async function getOldCharacter(data: { email: String, password: String }) {
    const playerResponse = await AxiosOldApiService.post('/player/login', data)

    const response = await AxiosOldApiService.get('/character', { headers: { authorization: `JOJO ${playerResponse.data.token}` } })

    return response.data
}

export async function getOldStand(data: { email: String, password: String }) {
    const playerResponse = await AxiosOldApiService.post('/player/login', data)

    const response = await AxiosOldApiService.get('/stand', { headers: { authorization: `JOJO ${playerResponse.data.token}` } })

    return response.data
}

export async function getOldSubstand(data: { email: String, password: String }) {
    const playerResponse = await AxiosOldApiService.post('/player/login', data)

    const response = await AxiosOldApiService.get('/substand', { headers: { authorization: `JOJO ${playerResponse.data.token}` } })

    return response.data
}

export async function getOldInventory(data: { email: String, password: String }) {
    const playerResponse = await AxiosOldApiService.post('/player/login', data)

    const response = await AxiosOldApiService.get('/inventory', { headers: { authorization: `JOJO ${playerResponse.data.token}` } })

    return response.data
}
