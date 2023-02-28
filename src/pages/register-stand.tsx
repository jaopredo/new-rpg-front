import { useState, useRef, useEffect, Children, ChangeEvent } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';

import styles from '@/sass/Sheet.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'
import PointsContainer from '@/components/PointsContainer'
import Ability from '@/components/Ability'

/* CONFIGS */
import {
    getStandAttributes,
    getStandPDAbilitys,

    defaultAttrConfigs
} from '@/api/config'

/* TYPES */
import {
    StandFormValues,

    StandInputInfoProps,
    StandAbility,
    StandAttributes,
} from '@/types/';


interface StandFormsProps {
    register: Function
}

function SubStand({ register }: StandFormsProps) {
    const [ substandInputInfos, setSubstandInputInfos ] = useState<StandInputInfoProps[]>([])

    const [ subStandSpentPointsError, setSubStandSpentPointsError ] = useState<boolean>(false)

    const [ subStandSpentPoints, setSubStandSpentPoints ] = useState<number>(0)
    const subStandPoints = 14

    useEffect(() => {
        async function getData() {
            setSubstandInputInfos(await getStandAttributes())
        }
        getData()
    }, [])

    const handleAttrChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }

    // const subStandPoints = 14;  // Máximo de pontos de um substand
    // const [ subStandSpentPoints, setSubStandSpentPoints ] = useState(0);  // Pontos gastos no substand

    // const actStandPoints = {  // Pontos de cada ato
    //     act1: 10,
    //     act2: 13,
    //     act3: 15,
    //     act4: 18
    // }
    // const [ actStandSpentPoints, setActStandSpentPoints ] = useState(defaultAttrConfigs().acts)


    return <fieldset className={styles.substandFieldset}>
        <legend>SUBSTAND</legend>
        <fieldset className={styles.subStandBasic}>
            <ul>
                <li>
                    <input className={styles.name} {...register('substand.basic.name')}/>
                </li>
                <li>
                    <label htmlFor='subStandType'>Tipo: </label>
                    <select id='subStandType' {...register('substand.basic.standType', { required: true })}>
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
                    <label htmlFor='subStandWeakPoint'>Ponto fraco: </label>
                    <input id='subStandWeakPoint' type="text" {...register('substand.basic.weakPoint')}/>
                </li>
            </ul>
        </fieldset>
        <fieldset className={styles.subStandAttributes}>
            <h4>ATRIBUTOS</h4>
            <p>Pontos gastos: <PointsContainer error={subStandSpentPointsError}>{subStandSpentPoints}</PointsContainer></p>
            <p>Máximo: <PointsContainer>{subStandPoints}</PointsContainer></p>
            <ul>
                {Children.toArray(substandInputInfos.map(
                    props => <li>
                        <label className={styles.subStandLabel} htmlFor={props.id}>{props.label}</label>
                        <input
                            type="number"
                            min={0}
                            max={5}
                            defaultValue={0}
                            className={styles.subStandAttr}
                            id={props.id}
                            {...register(`substand.attributes.${props.id}`, {
                                required: true,
                                valueAsNumber: true,
                                max: 5,
                                min: 0,
                                onChange: handleAttrChange,
                            })}
                        />
                    </li>
                ))}
            </ul>
        </fieldset>
        <fieldset>
            <Ability title='Principal' register={register} abName='substand.ability' />
        </fieldset>
    </fieldset>
}

function NormalStand({ register }: StandFormsProps) {
    const [ showSubstand, setShowSubstand ] = useState<boolean>(false)

    const [ standInputInfos, setStandInputInfos ] = useState<StandInputInfoProps[]>()
    const [ abilitys, setAbilitys ] = useState<Array<Object>>()
    const [ pdAbility, setPDAbility ] = useState<{
        firstMain?: StandAbility,
        secondMain?: StandAbility,
        passive?: StandAbility,
        substand?: boolean
    }>()

    const [ standPointError, setStandPointError ] = useState<boolean>(false)

    const [ standSpentPoints, setStandSpentPoints ] = useState<number>(0)
    const standPoints = 20

    useEffect(() => {
        async function getData() {
            setStandInputInfos(await getStandAttributes())
            setAbilitys(await getStandPDAbilitys())
        }
        getData()
    }, [])

    useEffect(() => {
        setStandPointError(standSpentPoints > standPoints)
    }, [ standSpentPoints ])


    const actualAttrValues = useRef<StandAttributes>(defaultAttrConfigs().stand)
    function changeActualValue(value: number, id: string) {
        actualAttrValues.current = {
            ...actualAttrValues.current,
            [id]: value,
        };
    }

    
    const handleAttrChange = function(e: ChangeEvent<HTMLInputElement>) {
        e.target.value = e.target.value>"5"?"5":e.target.value<"0"?"0":e.target.value
        const { id } = e.target
        const value = Number(e.target.value)

        if (id === "development") {
            setPDAbility(abilitys?.[value])
        }

        // Checando se aumentou ou diminuiu
        setStandSpentPoints(standSpentPoints - (actualAttrValues.current[id] - Number(value)))

        changeActualValue(Number(value), id)
    }

    useEffect(() => {
        setShowSubstand(!!pdAbility?.substand)
    }, [ pdAbility ])


    return <>
        <fieldset className={styles.attrFieldset}>
            <div className='points-info-container'>
                <p>Pontos Gastos <PointsContainer error={standPointError}>{standSpentPoints}</PointsContainer></p>
                <p>Máximo <PointsContainer>{standPoints}</PointsContainer></p>
            </div>
            {/* DIV QUE CONTÉM OS ATRIBUTOS */}
            <div className={styles.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul className='generic-list'>
                    {Children.toArray(standInputInfos?.map((props) => <li>
                        {/**
                         * INPUT INFOS = {id: 'id', label: 'texto'}
                         */}
                        <label htmlFor={props.id}>{props.label}</label>
                        <input
                            type='number'
                            min={0}
                            max={5}
                            defaultValue={0}
                            id={props.id}
                            {...register(`stand.attributes.${props.id}`, {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                                max: 5,
                                onChange: handleAttrChange,
                            })}
                        />
                    </li>
                    ))}
                </ul>
            </div>
        </fieldset>
        { showSubstand && <SubStand register={register}/> }
        <fieldset className={styles.abilitysFieldset}>
            {
                pdAbility?.firstMain && <Ability
                    title='Principal'
                    register={register}
                    abName='stand.abilitys.firstMain'
                />
            }
            {
                pdAbility?.secondMain && <Ability
                    title='Secundário'
                    register={register}
                    abName='stand.abilitys.secondMain'
                />
            }
            {
                pdAbility?.passive && <Ability
                    title='Passiva'
                    register={register}
                    abName='stand.abilitys.passive'
                />
            }
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
                    <input type='text' className={styles.name} {...register('stand.basic.name', { required: true })} />
                </li>
                <li>
                    <label htmlFor='standType'>Tipo: </label>
                    <select id='standType' {...register('stand.basic.standType', { required: true })}>
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
                    <input id='weakPoint' type="text" {...register('stand.basic.weakPoint')}/>
                    <p className='warning'>5: A, 4: B, 3: C, 2: D, 1: E, 0: Nulo</p>
                </li>
            </ul>
        </fieldset>
        {!isActStand && <NormalStand register={register}/>}
        <div className={styles.buttonContainer}>
            <button>ENVIAR</button>
        </div>
    </form></MainContainer>
}

export default RegisterStand;