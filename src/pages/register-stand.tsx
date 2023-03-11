import { useState, useRef, useEffect, Children, ChangeEvent } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { getCookie } from 'cookies-next'
import Router from 'next/router'

import styles from '@/sass/Sheet.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'
import PointsContainer from '@/components/PointsContainer'
import Ability from '@/components/Ability'
import ErrorParagraph from '@/components/ErrorParagraph'

/* CONFIGS */
import {
    getStandAttributes,
    getStandPDAbilitys,

    defaultAttrConfigs
} from '@/api/config'

/* API */
import { 
    registerStand, registerSubstand
} from '@/api/stand'

/* TYPES */
import {
    StandFormValues,

    StandInputInfoProps,
    StandAbility,
    StandAttributes,
} from '@/types/';


interface StandFormsProps {
    register: Function,
    maxPoints?: number,
    maxActPoints?: {
        act1: number;
        act2: number;
        act3: number;
        act4: number;
    },
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
    useEffect(() => {
        setSubStandSpentPointsError(subStandPoints < subStandSpentPoints)
    }, [ subStandSpentPoints ])

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

        // Checando se aumentou ou diminuiu
        setSubStandSpentPoints(subStandSpentPoints - (actualAttrValues.current[id] - Number(value)))

        changeActualValue(Number(value), id)
    }


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

interface ActProps {
    register: Function,
    num: number,
    maxPoints: {
        act1: number,
        act2: number,
        act3: number,
        act4: number
    },
    actStandSpentPoints: {
        act1: number,
        act2: number,
        act3: number,
        act4: number
    },
    setActStandSpentPoints: Function
}

function Act({ register, num, maxPoints, actStandSpentPoints, setActStandSpentPoints }: ActProps) {
    let atoAtual: "act1" | "act2" | "act3" | "act4" = `act${num}`

    const [ actInputInfos, setActInputInfos ] = useState<StandInputInfoProps[]>([])

    useEffect(() => {
        async function getData() {
            setActInputInfos(await getStandAttributes())
        }
        getData()
    }, [])

    const actualValues = useRef<StandAttributes>(defaultAttrConfigs().stand)
    function changeActualValue(id: string, value: number) {
        actualValues.current[id] = value
    }

    // Colocar erro no span
    const [ actPointsError, setActPointsError ] = useState(false)

    useEffect(() => {
        setActPointsError(actStandSpentPoints[atoAtual] > maxPoints[atoAtual])
    }, [ actStandSpentPoints ])

    function handleAttrChange(e: ChangeEvent<HTMLInputElement>) {
        e.target.value = e.target.value>5?5:e.target.value<0?0:e.target.value
        const { id } = e.target;
        const value = Number(e.target.value)

        setActStandSpentPoints({
            ...actStandSpentPoints,
            [atoAtual]: actStandSpentPoints[atoAtual] - (actualValues.current[id] - value)
        })

        changeActualValue(id, value)
    }

    return <div className={styles.act}>
        <h3>Ato {num}</h3>
        <div>
            <label htmlFor={`${atoAtual}-img`}>Link da Imagem: </label>
            <input type="text" id={`${atoAtual}-img`} {...register(`stand.acts.${atoAtual}.img`)} />
        </div>
        <fieldset>
            <p>Pontos gastos: <PointsContainer error={actPointsError}>{actStandSpentPoints[atoAtual]}</PointsContainer></p>
            <p>Máximo: <PointsContainer>{maxPoints[atoAtual]}</PointsContainer></p>
            <div className={styles.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul>
                    {Children.toArray(actInputInfos.map(
                        props => props.id != "development" && <li>
                            <label htmlFor={props.id}>{props.label}</label>
                            <input
                                type="number"
                                min={0}
                                max={5}
                                defaultValue={0}
                                id={props.id}
                                {...register(`stand.acts.${atoAtual}.attributes.${props.id}`, {
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
            </div>
        </fieldset>
        <Ability
            register={register}
            abName={`stand.acts.${atoAtual}.ability`}
            title='Habilidade'
        />
    </div>
}
function ActStand({ register, maxActPoints }: StandFormsProps) {
    const [ actStandSpentPoints, setActStandSpentPoints ] = useState<{
        act1: number,
        act2: number,
        act3: number,
        act4: number
    }>({
        act1: 0,
        act2: 0,
        act3: 0,
        act4: 0
    })

    return <fieldset className={styles.actsFieldset}>
        { Children.toArray([1, 2, 3, 4].map(actNum =>
            <Act
                register={register}
                num={actNum}
                maxPoints={maxActPoints}
                actStandSpentPoints={actStandSpentPoints}
                setActStandSpentPoints={setActStandSpentPoints}
            />
        )) }
    </fieldset>
}


const RegisterStand: React.FC = () => {
    const substandMaxPoints = 14
    const standMaxPoints = 20
    const actStandMaxPoints = {
        act1: 10,
        act2: 13,
        act3: 15,
        act4: 18
    }

    const handleDice = (d: string) => {
        const [ dice ] = d.split('_')
        return dice
    }

    const [ errorMessage, setErrorMessage ] = useState<string>("")

    const [ isActStand, setIsActStand ] = useState<boolean>(false)

    const { register, handleSubmit } = useForm<StandFormValues>()

    const onSubmit: SubmitHandler<StandFormValues> = async(data) => {
        const newData = { ...data }
        const charId = getCookie('charId')

        // Limpando as informações desnecessárias e analisando os pontos
        if (newData.stand.basic.standType == "act") {
            newData.stand.abilitys = undefined
            newData.stand.attributes = undefined
            newData.substand = undefined

            Object.keys(data.stand.acts).forEach(act => {
                newData.stand.acts[act].ability.dice = handleDice(data.stand.acts[act].ability.dice)
            })

            let error = false
            Object.keys(newData.stand.acts ?? []).forEach(act => {
                let somatorio = 0
                for (let num of Object.values(newData.stand.acts?.[act].attributes)) {
                    somatorio += num
                }
                console.log(somatorio)
                if (somatorio > actStandMaxPoints[act] || somatorio < actStandMaxPoints[act]) {
                    error = true
                    return
                }
            })

            if (error) {
                setErrorMessage("Erro nos atributos dos ATOS")
                return
            }
        } else {
            newData.stand.acts = undefined

            Object.keys(data.stand.abilitys).forEach(abName => {
                newData.stand.abilitys[abName].dice = handleDice(data.stand.abilitys[abName].dice)
            })

            // Somando atributos do stand
            let somatorio = 0
            Object.values(newData.stand.attributes ?? []).forEach((attr: number) => {
                somatorio += attr
            })

            if (somatorio > standMaxPoints || somatorio < standMaxPoints) {
                setErrorMessage("Erro no somatório dos pontos dos atributos do stand!")
                return
            }

            somatorio = 0
            Object.values(newData.substand?.attributes ?? []).forEach((attr: number) => {
                somatorio += attr
            })

            if (!!data.substand && (somatorio > substandMaxPoints || somatorio < substandMaxPoints)) {
                setErrorMessage("Erro no somatório dos pontos dos atributos do substand!")
                return
            }
        }

        const { standId } = await registerStand({
            charId,
            ...newData.stand
        })
        if (!!newData.substand) {
            await registerSubstand({
                standId,
                ...newData.substand
            })
        }

        Router.push('/logged')
    }

    const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {
        setIsActStand(e.target.value === "act")
    }

    return <MainContainer><form onSubmit={handleSubmit(onSubmit)} className={isActStand?styles.actStandRegister:styles.standRegister}>
        <fieldset className={styles.basicFieldset}>
            <ul>
                <li>
                    <input type='text' className={styles.name} {...register('stand.basic.name', { required: true })} />
                </li>
                <li>
                    <label htmlFor='standType'>Tipo: </label>
                    <select id='standType' {...register('stand.basic.standType', { required: true, onChange: handleChangeType })}>
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
        {!isActStand && <NormalStand register={register} maxPoints={standMaxPoints}/>}
        {isActStand && <ActStand register={register} maxActPoints={actStandMaxPoints}/>}
        <div className={styles.buttonContainer}>
            <ErrorParagraph>{errorMessage}</ErrorParagraph>
            <button type="submit">ENVIAR</button>
        </div>
    </form></MainContainer>
}

export default RegisterStand;