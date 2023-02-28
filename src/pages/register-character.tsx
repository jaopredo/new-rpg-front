import { useState, useRef, useEffect, Children } from 'react'
import { getCookie } from 'cookies-next'
import { useForm, SubmitHandler } from 'react-hook-form'
import Router from 'next/router'

import styles from '@/sass/Sheet.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'
import PointsContainer from '@/components/PointsContainer'
import ErrorParagraph from '@/components/ErrorParagraph'

/* TYPES */
import {
    CharacterFormValues,
    CharacterInputInfoProps,
    CharacterInputSpecProps,
    
    CharacterAttributes,
} from '@/types/'

/* API CONFIGS */
import {
    getLabels,
    getRaceAdvantages,
    getFightStyleAdvantages,
    defaultAttrConfigs,

    getCharAttributes,
    getCharSpecialitys
} from '@/api/config'

import { registerCharacter } from '@/api/character'

export default function RegisterCharacter() {
    const [ errorMessage, setErrorMessage ] = useState<string>("")

    const [ charInputInfos, setCharInputInfos ] = useState<CharacterInputInfoProps[]>()
    const [ charSpecsInfos, setCharSpecsInfos ] = useState<CharacterInputSpecProps>()

    const raceAdvantages = useRef<Object>(getLabels().race)  // Objeto que vai ter os textos das vantagens (Raças)
    const racesTraduzidas = {
        human: "HUMANO",
        vampire: "VAMPÍRO",
        rockman: "HOMEM-PEDRA",
        animal: "ANIMAL"
    }  // Objeto com as traduções (Não ficar em inglês)

    const fightStyleAdvantages = useRef<Object>(getLabels().fightStyle)  // Objeto que vai ter os textos das vantagens (Estilos de Luta)
    const fightsTraduzidos = {
        none: "NENHUM",
        hamon: "HAMON",
        spin: "SPIN",
        fencing: "ESGRIMA",
        shooter: "ATIRADOR",
        fighter: "LUTADOR"
    }  // Objeto com a tradução

    // Atributos máximos de cada raça
    const attrMaxInfos = useRef<Object>()

    const [ raceAttrsInfos, setRaceAttrsInfos ] = useState<Object>({})  // Vantagens de cada raça
    const [ fightStyleSpecsInfos, setFightStyleSpecsInfos ] = useState<Object>({})  // Vantagens de cada estilo de luta

    // Informações sobre os pontos gastos
    const [attrSpentPoints, setAttrSpentPoints] = useState(0);  // Pontos gastos nos atributos
    const [specSpentPoints, setSpecsSpentPoints] = useState(9);  // Minimo de especialidades


    const attrMinValues = useRef<CharacterAttributes>(defaultAttrConfigs().character)  // Os valores mínimos de cada atributo
    function setMinValue(value: number, id: string) {
        attrMinValues.current = {
            ...attrMinValues.current,
            [id]: value
        }
    }

    const actualAttrValues = useRef<Object>(defaultAttrConfigs().character)
    function changeActualValue(value: number, id: string) {  // Muda o valor atual
        actualAttrValues.current = {
            ...actualAttrValues.current,
            [id]: value,
        }
    }

    const attrPoints = 30;  // Pontos máximos pros atributos
    const [attrMax, setAttrMax] = useState<number>(10);

    // Texto vantagens das raças
    const [ raceAdvs, setRaceAdvantages ] = useState<string>('');
    // Texto vantagens dos estilos de luta
    const [ fightAdvs, setFightAdvs ] = useState<string>('')


    // Pegando informações na API
    useEffect(() => {
        async function getData() {
            const raceAttrAdvantages = await getRaceAdvantages()
            setRaceAttrsInfos(raceAttrAdvantages)
            const fightStyleSpecs = await getFightStyleAdvantages()
            setFightStyleSpecsInfos(fightStyleSpecs)
            
            const charInputInfosResponse = await getCharAttributes()
            setCharInputInfos(charInputInfosResponse)
            const charInputSpecsResponse = await getCharSpecialitys()
            setCharSpecsInfos(charInputSpecsResponse)
        }
        getData()
    }, [])


    const { register, handleSubmit, setValue, getValues } = useForm<CharacterFormValues>()

    const onSubmit: SubmitHandler<CharacterFormValues> = async function (data) {
        if (specSpentPoints != 0) {
            setErrorMessage("Use todas suas especialidades!")
            return
        }
        if (attrSpentPoints != attrPoints) {
            setErrorMessage("Você deve utilizar a quantidade correta de pontos nos atributos")
            return
        }

        await registerCharacter(data)
        Router.push('/register-stand')
    }


    const [ specPointError, setSpecPointError ] = useState<boolean>(false)  // Erro das especialidades
    const [ attrPointError, setAttrPointError ] = useState<boolean>(false)

    /* CHECANDO SE OS PONTOS ESTÃO CORRETOS */
    useEffect(() => {
        setSpecPointError(specSpentPoints < 0)
    }, [specSpentPoints])


    /* FUNÇÕES DOS INPUTS */
    // Função que lida quando o atributo muda
    const handleAttrChange = function(e: any, minValue: number) {
        e.target.value = e.target.value>attrMax?attrMax:e.target.value<minValue?minValue:e.target.value
        
        const { value, id }: HTMLInputElement = e.target;
        setAttrSpentPoints(attrSpentPoints - (actualAttrValues.current?.[id] - Number(value)))

        changeActualValue(Number(value), id)
    }
    // Função que ativa quando ativa uma especialidade
    const handleSpecChange = function(e: any) {
        const { checked } = e.target;
        checked?setSpecsSpentPoints(specSpentPoints-1):setSpecsSpentPoints(specSpentPoints+1);
    }


    // Função que lida quando a raça muda
    const [ lastRace, setLastRace ] = useState<"human" | "animal" | "rockman" | "vampire">();
    const handleRaceChange = (e: any) => {
        const { value: race } = e.target
        setRaceAdvantages(raceAdvantages.current?.[race])  // Muda o texto das vantagens
        setAttrMax(attrMaxInfos.current?.[race])  // Muda até qual valor pode ser colocado

        // Retiro as vantagens da última raça colocada
        raceAttrsInfos?.[lastRace]?.forEach(attr => {
            const newValue = actualAttrValues.current?.[attr[0]] - attr[1]
            changeActualValue(newValue, attr[0])
            setMinValue(1, attr[0])
            setValue(
                `attributes.${attr[0]}`,
                newValue
            )
        })

        // Para cada raça dentro das raças
        raceAttrsInfos?.[race].forEach(attr => {  // Eu analiso cada vantagem
            // Estrutura
            // [ atributo, bonus ]
            //      0        1
            const newValue = actualAttrValues.current?.[attr[0]] + attr[1]
            const newMinValue = 1 + attr[1]
            changeActualValue(newValue, attr[0])
            setMinValue(newMinValue,  attr[0])
            setValue(
                `attributes.${attr[0]}`,
                newValue
            )
        })

        // Se a raça for vampíro, eu coloco para que nenhum estilo de luta possa ser colocado
        const fightSelect = document.getElementById('fightStyle');
        if (race === 'vampire' || race === "animal") {
            setValue('basic.fightStyle', 'none')
            Object.keys(fightStyleSpecsInfos || []).map(fs => removeFightStyleSpecs(fs))
            fightSelect.disabled = true
        } else {
            fightSelect.disabled = false
        }
    }

    // Função que lida com a mudança do estilo de luta
    const [ lastFightStyle, setLastFightStyle ] = useState();

    function removeFightStyleSpecs(fs: string /* FIGHT STYLE */) {
        fightStyleSpecsInfos[fs]?.forEach(spec => {
            setValue(`specialitys.${spec[1]}.${spec[0]}`, false)
            document.getElementById(`${spec[0]}`).disabled = false
        })
    }

    const handleFightStyleChange = function (e: any) {
        const { value: fightStyle } = e.target  // Pego o estilo de luta atual
        setFightAdvs(fightStyleAdvantages.current[fightStyle])  // Mudo o texto

        let counter = 0  // Contador para quantos estilos de lutas estão iguais comparando os que ja tem e os que vão ser colocados
        // Trecho de Código para colocar as especialidades das raças (Em desenvolvimento)
        fightStyleSpecsInfos[fightStyle]?.forEach(spec => {
            if (getValues(`specialitys.${spec?.[1]}.${spec?.[0]}`)) counter += 1
            setSpecsSpentPoints(specSpentPoints + counter)

            setValue(`specialitys.${spec?.[1]}.${spec?.[0]}`, true)
            document.getElementById(`${spec?.[0]}`).disabled = true
        })

        removeFightStyleSpecs(lastFightStyle)
    }


    return <MainContainer><form onSubmit={handleSubmit(onSubmit)} className={styles.charRegister}>
        <fieldset className={styles.basicFieldset}>
            <ul>
                <li>
                    <input type='text' className={styles.name} {...register('basic.name', { required: true })} />
                </li>
                <li>
                    <label htmlFor='race'>Raça: </label>
                    <select id='race' {...register('basic.race', { 
                        required: true,
                        onChange: handleRaceChange,
                    })} onFocus={e => {
                        setLastRace(e.target.value)
                        e.target.blur()
                    }}>
                        <option disabled selected> -- SELECIONE -- </option>
                        {Children.toArray(Object.keys(raceAttrsInfos || []).map(
                            (adv: string) => <option value={adv}>{racesTraduzidas[adv]}</option>
                        ))}
                    </select>
                    <p className={styles.beneficts}>Benefícios: {raceAdvs}</p>
                    <p className={styles.warning}>
                        Esses benefícios vão ser calculados automaticamente quando o formulário for enviado!
                    </p>
                </li>
                <li>
                    <label htmlFor='fightStyle'>Estilo de Luta: </label>
                    <select id='fightStyle' {...register('basic.fightStyle', { 
                        required: true,
                        onChange: handleFightStyleChange,
                    })} onFocus={e => {
                        setLastFightStyle(e.target.value)
                        e.target.blur()
                    }}>
                        <option disabled selected> -- SELECIONE -- </option>
                        {Children.toArray(Object.keys(fightStyleSpecsInfos || []).map(
                            (adv: string) => <option value={adv}>{fightsTraduzidos[adv]}</option>
                        ))}
                    </select>
                    <p className={styles.beneficts}>Benefícios: {fightAdvs}</p>
                    <p className={styles.warning}>
                        Esses benefícios vão ser calculados automaticamente quando o formulário for enviado!
                    </p>
                </li>
                <li>
                    <label htmlFor='age'>Idade: </label>
                    <input id='age' type='number' min={20} {...register('basic.age', {
                        required: true,
                        valueAsNumber: true,
                        min: 20,
                    })} />
                </li>
                <li>
                    <label htmlFor='occupation'>Profissão: </label>
                    <input id='occupation' type="text" {...register('basic.occupation', { required: true })}/>
                </li>
            </ul> 
        </fieldset>
        <fieldset className={styles.attrFieldset}>
            <div className='points-info-container'>
                <p>Pontos Gastos <PointsContainer error={attrPointError}>{attrSpentPoints}</PointsContainer></p>
                <p>Máximo <PointsContainer>{attrPoints}</PointsContainer></p>
            </div>
            {/* DIV QUE CONTÉM OS ATRIBUTOS */}
            <div className={styles.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul className='generic-list'>
                    {Children.toArray(charInputInfos?.map((props) => <li>
                        {/**
                         * INPUT INFOS = {id: 'id', label: 'texto'}
                         */}
                        <label htmlFor={props.id}>{props.label}</label>
                        <input
                            type='number'
                            className={'attribute'}
                            min={attrMinValues.current[props.id]}
                            max={attrMax}
                            defaultValue={1}
                            id={props.id}
                            {...register(`attributes.${props.id}`, {
                                required: true,
                                valueAsNumber: true,
                                min: -2,
                                onChange: e => handleAttrChange(e, attrMinValues.current[props.id]),
                            })}
                        />
                    </li>
                    ))}
                </ul>
            </div>
        </fieldset>
        <fieldset className={styles.specsFieldset}>
            <h3>Especialidades</h3>
            <PointsContainer error={specPointError}>{specSpentPoints}</PointsContainer>
            <table>
                <thead>
                    <tr><th>Nome</th><th>Check</th></tr>
                </thead>
                {Children.toArray(Object.keys(charSpecsInfos ?? []).map(
                    (area: any) => <tbody>
                        {Children.toArray(charSpecsInfos?.[area].map(props => <tr className={props.area}>
                            <td><label htmlFor={props.id}>{props.label}</label></td>
                            <td><input type='checkbox' id={props.id} {...register(
                                `specialitys.${props.area}.${props.id}`,
                                {
                                    onChange: handleSpecChange
                                }
                            )}/></td>
                        </tr>))}
                    </tbody>
                ))}
            </table>
        </fieldset>
        <div className={styles.buttonContainer}>
            <ErrorParagraph>{errorMessage}</ErrorParagraph>
            <button className={styles.submitButton} type='submit'>ENVIAR</button>
        </div>
    </form></MainContainer>
}
