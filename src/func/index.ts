import { getCookie } from "cookies-next"

export const returnAuthHeader = () => ({
    authorization: `JOJO ${getCookie('token')}`
})