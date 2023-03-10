import { getCookie } from "cookies-next"

export const returnAuthHeader = () => ({
    authorization: `JOJO ${getCookie('token')}`
})

export const returnRollConfigsByString = (dice: string) => {
    const [ times, faces ] = dice.split('D')

    return {
        times: Number(times),
        faces: Number(faces)
    }
}
