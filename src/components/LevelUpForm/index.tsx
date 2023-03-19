import { MouseEventHandler, useState, Children } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { getCookie } from "cookies-next"
import Router from "next/router"

import sheetStyle from '@/sass/Sheet.module.scss'
import styles from './style.module.scss'

import { characterAttributesTranslate, characterSpecialitysTranslate } from "src/func/translate"

/* COMPONENTS */
import { WindowContainer, Error } from "../Containers"

/* TYPES */
import { CharacterAttributes, CharacterAttributesKeys, CharacterSpecialitys } from "@/types/character"
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
        (Object.keys(specialitys) as Array<keyof typeof specialitys>).forEach(specArea => {
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

        const response = await levelUp(getCookie("charId") as string, newData)
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
                    {Children.toArray((Object.keys(attributes) as Array<keyof typeof attributes>).map((attr) => <li className={styles.levelUpAttributeContainer}>
                        <label htmlFor={attr+`levelup`}>{characterAttributesTranslate[attr]}</label>
                        <span className={sheetStyle.spanContainer}>{ actualCharAttrInfos[attr] }</span>
                        <input type="radio" id={attr+"levelup"} value={attr} {...register(`obj.label`)}/>
                    </li>))}
                </ul>
            </> }
            { choose == "spec" && <>
                <h2 className={styles.attrTitle}>VOCÊ PODE ESCOLHER <span>1 ESPECIALIDADE</span></h2>
                <select {...register('obj.newSpec')}>
                    {Children.toArray((Object.keys(specialitys) as Array<keyof typeof specialitys>).map(area => {
                        const specArea = specialitys[area]
                        return <optgroup label={characterAttributesTranslate[area]}>
                            {Children.toArray((Object.keys(specArea) as Array<keyof typeof specArea>).map(
                                spec => !specArea[spec] &&
                                    <option value={spec}>{characterSpecialitysTranslate[spec]}</option>
                            ))}
                        </optgroup>
                    }))}
                </select>
            </> }
            <button>UPAR</button>
            <Error>{ errorMsg }</Error>
        </form>
    </WindowContainer>
}

export default LevelUpForm