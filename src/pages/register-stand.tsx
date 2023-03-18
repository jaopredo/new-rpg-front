import { useState, useRef, useEffect, Children, ChangeEvent } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { getCookie } from 'cookies-next'
import Router from 'next/router'

import styles from '@/sass/Sheet.module.scss'

/* FUNCTIONS */
import { handleDice } from '../func'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'
import PointsContainer from '@/components/PointsContainer'
import Ability from '@/components/Ability'
import ErrorParagraph from '@/components/ErrorParagraph'
import { LoaderWindowContainer } from '@/components/Containers'

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

    StandAttributeInput,
    StandAttributesKeys,
    StandType,
    SubstandType
} from '@/types/stand';


interface StandFormsProps {
    register: Function,
    maxPoints: number
}

function SubStand({ register }: Omit<StandFormsProps, "maxPoints">) {
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
        }
    }

    
    const handleAttrChange = function(e: ChangeEvent<StandAttributeInput>) {
        e.target.value = e.target.value>5?5:e.target.value<0?0:e.target.value
        const { id } = e.target
        const value = e.target.value

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
                <li>
                    <label htmlFor="subStandImg">Link Imagem: </label>
                    <input id='subStandImg' type="text" {...register('substand.basic.img')} />
                </li>
            </ul>
        </fieldset>
        <fieldset className={styles.subStandAttributes}>
            <h4>ATRIBUTOS</h4>
            <p>Pontos gastos: <PointsContainer error={subStandSpentPointsError}>{subStandSpentPoints}</PointsContainer></p>
            <p>Máximo: <PointsContainer>{subStandPoints}</PointsContainer></p>
            <ul>
                {Children.toArray(substandInputInfos.map(
                    props => props.id !== "development" && <li>
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
        }
    }

    
    const handleAttrChange = function(e: ChangeEvent<StandAttributeInput>) {
        e.target.value = e.target.value>5?5:e.target.value<0?0:e.target.value
        const { id, value } = e.target

        if (id === "development") {
            setPDAbility(abilitys?.[value])
        }

        // Checando se aumentou ou diminuiu
        setStandSpentPoints(standSpentPoints - (actualAttrValues.current[id] - value))

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
    num: "act1" | "act2" | "act3" | "act4",
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
    const [ actInputInfos, setActInputInfos ] = useState<StandInputInfoProps[]>([])

    useEffect(() => {
        async function getData() {
            setActInputInfos(await getStandAttributes())
        }
        getData()
    }, [])

    const actualValues = useRef<StandAttributes>(defaultAttrConfigs().stand)
    function changeActualValue(id: StandAttributesKeys, value: number) {
        actualValues.current[id] = value
    }

    // Colocar erro no span
    const [ actPointsError, setActPointsError ] = useState(false)

    useEffect(() => {
        setActPointsError(actStandSpentPoints[num] > maxPoints[num])
    }, [ actStandSpentPoints ])

    function handleAttrChange(e: ChangeEvent<StandAttributeInput>) {
        e.target.value = e.target.value>5?5:e.target.value<0?0:e.target.value
        const { id, value } = e.target

        setActStandSpentPoints({
            ...actStandSpentPoints,
            [num]: actStandSpentPoints[num] - (actualValues.current[id] - value)
        })

        changeActualValue(id, value)
    }

    return <div className={styles.act}>
        <h3>Ato {num[3]}</h3>
        <div>
            <label htmlFor={`${num}-img`}>Link da Imagem: </label>
            <input type="text" id={`${num}-img`} {...register(`stand.acts.${num}.img`)} />
        </div>
        <fieldset>
            <p>Pontos gastos: <PointsContainer error={actPointsError}>{actStandSpentPoints[num]}</PointsContainer></p>
            <p>Máximo: <PointsContainer>{maxPoints[num]}</PointsContainer></p>
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
                                {...register(`stand.acts.${num}.attributes.${props.id}`, {
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
            abName={`stand.acts.${num}.ability`}
            title='Habilidade'
        />
    </div>
}

interface ActFormProps extends Omit<StandFormsProps, "maxPoints"> {
    maxActPoints: {
        act1: number;
        act2: number;
        act3: number;
        act4: number;
    },
}

function ActStand({ register, maxActPoints }: ActFormProps) {
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
        { Children.toArray((Object.keys(actStandSpentPoints) as Array<keyof typeof actStandSpentPoints>).map(actNum =>
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
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const substandMaxPoints = 14
    const standMaxPoints = 20
    const actStandMaxPoints = {
        act1: 10,
        act2: 13,
        act3: 15,
        act4: 18
    }

    const [ errorMessage, setErrorMessage ] = useState<string>("")

    const [ isActStand, setIsActStand ] = useState<boolean>(false)

    const { register, handleSubmit, setValue } = useForm<StandFormValues>()

    const onSubmit: SubmitHandler<StandFormValues> = async(data) => {
        const { standType } = data.stand.basic

        const newData = ({...data} as any) as {
            stand: Required<Pick<StandType, "basic" | "attributes" | "abilitys" | "acts">>,
            substand?: Required<SubstandType>,
        }

        const charId = getCookie('charId')

        // Limpando as informações desnecessárias e analisando os pontos
        if (standType == "act") {
            const { acts } = newData.stand
            
            let actKeys = Object.keys(acts) as Array<keyof typeof acts>
            actKeys.forEach(act => {
                newData.stand.acts[act].ability.dice = handleDice(acts[act].ability.dice)
            })

            let error = false
            
            actKeys.forEach(act => {
                let somatorio = 0
                for (let num of Object.values(acts[act].attributes)) {
                    somatorio += num
                }
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
            const { stand, substand } = newData

            let somatorio = 0
            for (let value of Object.values(stand.attributes)) {
                somatorio += value
            }

            if (somatorio !== standMaxPoints) {
                setErrorMessage("Seus atributos estão incorretos")
                return
            }

            if (substand) {
                somatorio = 0
                for (let value of Object.values(substand.attributes)) {
                    somatorio += value
                }

                if (somatorio !== substandMaxPoints) {
                    setErrorMessage("Seus atributos de substand estão incorretos")
                    return
                }
            }
        }
        
        setIsLoading(true)

        const standResponse = await registerStand({
            charId,
            ...newData.stand
        })
        if (standResponse.error) {
            setIsLoading(false)
            setErrorMessage(standResponse.msg)
        }
        if (!!newData.substand) {
            const substandResponse = await registerSubstand({
                charId,
                ...newData.substand
            })

            if (substandResponse.error) {
                setIsLoading(false)
                setErrorMessage(standResponse.msg)
            }
        }

        Router.push('/logged')
    }

    const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {
        const itIs = e.target.value === "act"
        setIsActStand(itIs)
        if (itIs) {
            setValue('stand.attributes', undefined)
            setValue('stand.abilitys', undefined)
            setValue('substand', undefined)
        } else {
            setValue('stand.acts', undefined)
        }
    }

    return <MainContainer>
        <form onSubmit={handleSubmit(onSubmit)} className={isActStand?styles.actStandRegister:styles.standRegister}>
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
                    {!isActStand && <li>
                        <label htmlFor="standImage">Link da Imagem: </label>
                        <input id="standImage" {...register('stand.basic.img')} />
                    </li>}
                </ul>
            </fieldset>
            {!isActStand && <NormalStand register={register} maxPoints={standMaxPoints}/>}
            {isActStand && <ActStand register={register} maxActPoints={actStandMaxPoints}/>}
            <div className={styles.buttonContainer}>
                <ErrorParagraph>{errorMessage}</ErrorParagraph>
                <button type="submit">ENVIAR</button>
            </div>
        </form>
        { isLoading && <LoaderWindowContainer/> }
    </MainContainer>
}

export default RegisterStand