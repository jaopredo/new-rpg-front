import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { setCookie } from "cookies-next"
import Router from "next/router"

import styles from '@/sass/Form.module.scss'

/* API */
import { loginPlayer } from "@/api/player"

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"

/* TYPES */
import { PlayerFormValues } from "@/types/"

export default function Register() {
    const [ errorMsg, setErrorMsg ] = useState("")

    const { register, handleSubmit } = useForm<PlayerFormValues>()
    const onSubmit: SubmitHandler<PlayerFormValues> = async (data) => {
        if (data.password.length < 8) {
            setErrorMsg("A senha é menor que 8 caracteres")
            return
        }
        const response = await loginPlayer(data)
        if (response.token) {
            setCookie('token', response.token)
            Router.push('/logged')
        }
        if (response.error) {
            setErrorMsg(response.msg)
        }
    }

    return <MainContainer>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.genericForm}>
            <label htmlFor="email">Email: </label><input id="email" type="text" {...register("email")} />
            <label htmlFor="password">Senha: </label><input id="password" type="password" {...register("password")} />

            <button type="submit">REGISTRAR</button>
            { errorMsg }
        </form>
    </MainContainer>
}