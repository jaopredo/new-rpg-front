import { MouseEventHandler, useState, Children } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { getCookie } from "cookies-next"
import Router from "next/router"

import sheetStyle from '@/sass/Sheet.module.scss'
import styles from './style.module.scss'

/* COMPONENTS */
import { WindowContainer, Error } from "../Containers"

/* TYPES */
import { CharacterAttributes, CharacterSpecialitys } from "@/types/*"
import { levelUp } from "@/api/character"

interface LevelUpFormProps {
    closeWindow: MouseEventHandler,
    attributes: CharacterAttributes,
    specialitys: CharacterSpecialitys
}

interface FormProps {
    type: "attribute" | "spec",
    obj: any,
}

const LevelUpForm = ({ closeWindow, attributes, specialitys }: LevelUpFormProps) => {
    const { register, handleSubmit } = useForm<FormProps>()

    const [ choose, setChoose ] = useState<string>("")


    const seekSpecArea = (spec: string) => {
        let actualArea
        Object.keys(specialitys).forEach(specArea => {
            Object.keys(specialitys[specArea]).forEach(key => {
                if (key === spec) actualArea = specArea
            })
        })

        return actualArea
    }

    const [ errorMsg, setErrorMsg ] = useState<string>("")

    const onSubmit: SubmitHandler<FormProps> = async (data) => {
        const newData: { type: string, obj?: any } = { type: data.type }

        if (data.type == "attribute") {
            newData.obj = {
                [data.obj.label]: attributes[data.obj.label] + 1
            }
        } else if (data.type == "spec") {
            newData.obj = {
                spec: data.obj.newSpec,
                label: seekSpecArea(data.obj.newSpec)
            }
        } else {
            setErrorMsg("Nenhum selecionado!")
            return
        }

        const response = await levelUp(getCookie("charId"), newData)
        if (response.error) {
            setErrorMsg("Um erro aconteceu!")
            return
        }
        Router.reload()
    }
    
    const [ actualCharAttrInfos, setActualCharAttrInfos ] = useState<CharacterAttributes>(attributes)

    return <WindowContainer closeWindow={closeWindow}>
        <h1>UPANDO PERSONAGEM</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles.chooseList}>
                <li><label htmlFor="attrRadio">ATRIBUTO: </label><input type="radio" id="attrRadio" value="attribute" {...register("type")}
                    onClick={() => setChoose("attribute")}
                /></li>
                <li><label htmlFor="specRadio">ESPECIALIDADE: </label><input type="radio" id="specRadio" value="spec" {...register("type")}
                    onClick={() => setChoose("spec")}
                /></li>
            </ul>
            { choose == "attribute" && <>
                <h2 className={styles.attrTitle}>VOCÊ TEM <span>1 PONTO</span> PARA DISTRIBUIR</h2>
                <ul>
                    {Children.toArray(Object.keys(attributes).map((attr) => <li className={styles.levelUpAttributeContainer}>
                        <label htmlFor={attr+`levelup`}>{attr}</label>
                        <span className={sheetStyle.spanContainer}>{ actualCharAttrInfos[attr] }</span>
                        <input type="radio" id={attr+"levelup"} value={attr} {...register(`obj.label`)}/>
                    </li>))}
                </ul>
            </> }
            { choose == "spec" && <>
                <h2 className={styles.attrTitle}>VOCÊ PODE ESCOLHER <span>1 ESPECIALIDADE</span></h2>
                <select {...register('obj.newSpec')}>
                    {Children.toArray(Object.keys(specialitys).map(area => <optgroup label={area}>
                        {Children.toArray(Object.keys(specialitys[area]).map(
                            spec => !specialitys[area][spec] &&
                                <option value={spec}>{spec}</option>
                        ))}
                    </optgroup>))}
                </select>
            </> }
            <button>UPAR</button>
            <Error>{ errorMsg }</Error>
        </form>
    </WindowContainer>
}

export default LevelUpForm