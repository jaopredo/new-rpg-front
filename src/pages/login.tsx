import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { setCookie } from "cookies-next"
import Router from "next/router"
import { MoonLoader } from 'react-spinners'

import styles from '@/sass/Form.module.scss'

/* API */
import { loginPlayer } from "@/api/player"

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"

/* TYPES */
import { PlayerFormValues } from "@/types/player"

export default function Register() {
    const [ errorMsg, setErrorMsg ] = useState<string>("")
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const { register, handleSubmit } = useForm<PlayerFormValues>()
    const onSubmit: SubmitHandler<PlayerFormValues> = async (data) => {
        setIsLoading(true)

        if (data.password.length < 8) {
            setErrorMsg("A senha é menor que 8 caracteres")
            return
        }

        const response = await loginPlayer(data)

        if (response.error) {
            setIsLoading(false)
            setErrorMsg(response.msg)
            return
        }

        setCookie('token', response.token)
        
        Router.push('/logged')
    }

    return <MainContainer>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.genericForm}>
            <label htmlFor="email">Email: </label><input id="email" type="text" {...register("email")} />
            <label htmlFor="password">Senha: </label><input id="password" type="password" {...register("password")} />

            <button type="submit">LOGIN</button>
            { errorMsg }
            { isLoading && <MoonLoader color="#fefefe" /> }
        </form>
    </MainContainer>
}