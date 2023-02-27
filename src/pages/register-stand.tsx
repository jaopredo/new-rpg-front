import { useState, useRef, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';

import styles from '@/sass/Sheet.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'
import Attributes from '@/components/Attributes'

/* CONFIGS */
import {
    getStandAttributes,
    getStandPDAbilitys,

    defaultAttrConfigs
} from '@/api/config'

/* TYPES */
import {
    StandFormValues,

    StandInputInfoProps
} from '@/types/';


interface StandFormsProps {
    register: Function
}


function NormalStand({ register }: StandFormsProps) {
    const [ standInputInfos, setStandInputInfos ] = useState<StandInputInfoProps[]>()
    const [ abilitys, setAbilitys ] = useState<Object>()

    useEffect(() => {
        async function getData() {
            setStandInputInfos(await getStandAttributes())
            setAbilitys(await getStandPDAbilitys())
        }
        getData()
    }, [])

    return <>
        <fieldset className={styles.attrFieldset}>
        </fieldset>
    </>
}


function ActStand() {

}


const RegisterStand: React.FC = () => {

    const [ isActStand, setIsActStand ] = useState<boolean>(false)

    const { register, handleSubmit } = useForm<StandFormValues>()

    const onSubmit: SubmitHandler<StandFormValues> = data => {
        console.log(data)
    }

    return <MainContainer><form onSubmit={handleSubmit(onSubmit)} className={styles.standRegister}>
        <fieldset className={styles.basicFieldset}>
            <ul>
                <li>
                    <input type='text' className={styles.name} {...register('basic.name', { required: true })} />
                </li>
                <li>
                    <label htmlFor='standType'>Tipo: </label>
                    <select id='standType' {...register('basic.standType', { required: true })}>
                        <option defaultChecked value="short-range">Curto Alcance</option>
                        <option value="long-range">Longo Alcance</option>
                        <option value="automatic">Automático</option>
                        <option value="independent">Independente</option>
                        <option value="colony">Colônia</option>
                        <option value="act">Atos</option>
                        <option value="object">Objeto</option>
                        <option value="union">União</option>
                        <option value="ability">Habilidade</option>
                        <option value="sharing">Compartilhado</option>
                    </select>
                </li>
                <li>
                    <label htmlFor='weakPoint'>Ponto fraco: </label>
                    <input id='weakPoint' type="text" {...register('basic.weakPoint')}/>
                    <p className='warning'>5: A, 4: B, 3: C, 2: D, 1: E, 0: Nulo</p>
                </li>
            </ul>
        </fieldset>
        {!isActStand && <NormalStand register={register}/>}
    </form></MainContainer>
}

export default RegisterStand;