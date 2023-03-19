import { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import styled from "styled-components"
import Router from "next/router"

import { updateStandImage, updateSubstandImage } from '@/api/stand'
import { updateCharacterImage } from '@/api/character'


const ImageFormComponent = styled.form`
    position: absolute;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
        font-weight: bolder;
        color: #ff5353;
    }

    input {
        background: white;
        color: black;

        border-radius: 4px;
        border: none;

        font-size: 1.1em;
    }

    button:hover {
        background: #181818;
        cursor: pointer;
    }
`


interface ImageFormValues {
    imageUrl: string,
}

interface ImageFormProps {
    type: "char" | "stand" | "substand",
    charId?: string,
    standId?: string,
    substandId?: string,
}


const ImageForm = ({ type, standId, charId, substandId }: ImageFormProps) => {
    const [ errorMsg, setErrorMsg ] = useState<string>('')

    const { register, handleSubmit } = useForm<ImageFormValues>()

    const onSubmit: SubmitHandler<ImageFormValues> = async (data) => {
        let response
        let id
        switch (type) {
            case "stand":
                id = standId as string
                response = await updateStandImage(id, data.imageUrl)
                break
            case "char":
                id = charId as string
                response = await updateCharacterImage(id, data.imageUrl)
                break
            default:
                id = substandId as string
                response = await updateSubstandImage(id, data.imageUrl)
        }

        if (response.error) {
            setErrorMsg(response.msg)
            return
        }

        Router.reload()
    }

    return <ImageFormComponent onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Link da Imagem aqui!" {...register('imageUrl')} />
        <button>ENVIAR</button>
        <p>{errorMsg}</p>
    </ImageFormComponent>
}

export default ImageForm