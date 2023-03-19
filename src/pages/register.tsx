import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { setCookie } from "cookies-next"
import Router from "next/router"
import { MoonLoader } from 'react-spinners'

import styles from '@/sass/Form.module.scss'

/* API */
import { registerPlayer } from "@/api/player"
import { checkOldPlayer, getOldCharacter, getOldInventory, getOldStand, getOldSubstand } from "@/api/old"
import { registerCharacter } from "@/api/character"
import { registerStand, registerSubstand } from "@/api/stand"
import { putItem } from "@/api/inventory"

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
        let response: any
        if (data.password !== data.confPassw) {
            setErrorMsg("As senhas não coincidem!")
            return
        }
        if (data.password.length < 8) {
            setErrorMsg("A senha é menor que 8 caracteres")
            return
        }

        // Checando se ja existe na database anterior
        const existsOnPreviousDb = await checkOldPlayer(data.email)  // Checo se player já existe no banco anterior

        if (existsOnPreviousDb) {  // Se sim
            const registerResponse = await registerPlayer(data)

            if (registerResponse.error) {
                setIsLoading(false)
                setErrorMsg(registerResponse.msg)
                return
            }

            setCookie('token', registerResponse.token)

            /* Registro o personagem anterior */
            const charResponse = await getOldCharacter(data)

            if (charResponse.error) {
                setIsLoading(false)
                setErrorMsg(response.msg)
                return
            }
            await registerCharacter(charResponse)

            /* Registro o stand anterior */
            response = await getOldStand(data)

            if (response.error) {
                setIsLoading(false)
                setErrorMsg(response.msg)
                return
            }
            response.charId = charResponse._id

            await registerStand(response)

            /* Registro o substand (Se tiver) */
            response = await getOldSubstand(data)

            if (response.error) {
                setIsLoading(false)
                setErrorMsg(response.msg)
                return
            }

            if (response) {
                response.charId = charResponse._id
                await registerSubstand(response)
            }

            /* Adiciono os itens antigos */
            response = await getOldInventory(data)

            if (response.error) {
                setIsLoading(false)
                setErrorMsg(response.msg)
                return
            }

            for (let item of response.items) {
                putItem(charResponse._id, item)
            }
        } else {
            const response = await registerPlayer(data)
            if (response.token) {
                setCookie('token', response.token)
                Router.push('/logged')
            }
            if (response.error) {
                setErrorMsg(response.msg)
            }
        }

        Router.push('/logged')
    }

    return <MainContainer>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.genericForm}>
            <label htmlFor="name">Nome: </label><input id="name" type="text" {...register("name")} />
            <label htmlFor="email">Email: </label>
            <p>Se possui já um personagem no site antigo, utilize as crendenciais anteriores e crie um nome, por favor!</p>
            <input id="email" type="text" {...register("email")} />
            <label htmlFor="password">Senha: </label><input id="password" type="password" {...register("password")} />
            <label htmlFor="confPassw">Confirmar Senha: </label><input id="confPassw" type="password" {...register("confPassw")} />

            <button type="submit">REGISTRAR</button>
            { errorMsg }
            { isLoading && <MoonLoader color="#a5a5a5"/>}
        </form>
    </MainContainer>
}