import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { setCookie } from "cookies-next"
import Router from "next/router"
import { MoonLoader } from 'react-spinners'

import styles from '@/sass/Form.module.scss'

/* API */
import { registerPlayer } from "@/api/player"

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"

/* TYPES */
import { PlayerFormValues } from "@/types/player"

export default function Register() {
    const [ errorMsg, setErrorMsg ] = useState<string>("")
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const { register, handleSubmit } = useForm<PlayerFormValues>()
    const onSubmit: SubmitHandler<PlayerFormValues> = async (data) => {
        if (data.password !== data.confPassw) {
            setErrorMsg("As senhas não coincidem!")
            return
        }
        if (data.password.length < 8) {
            setErrorMsg("A senha é menor que 8 caracteres")
            return
        }

        setIsLoading(true)
        const response = await registerPlayer(data)
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
            <label htmlFor="name">Nome: </label><input id="name" type="text" {...register("name")} />
            <label htmlFor="email">Email: </label><input id="email" type="text" {...register("email")} />
            <label htmlFor="password">Senha: </label><input id="password" type="password" {...register("password")} />
            <label htmlFor="confPassw">Confirmar Senha: </label><input id="confPassw" type="password" {...register("confPassw")} />

            <button type="submit">REGISTRAR</button>
            { errorMsg }
            { isLoading && <MoonLoader color="#a5a5a5"/>}
        </form>
    </MainContainer>
}