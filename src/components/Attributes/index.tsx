import { Children, useState, useEffect } from 'react'
import { UseFormRegister } from 'react-hook-form'

import styles from './styles.module.scss'

import { CharacterFormValues, CharacterInputInfoProps, CharacterAttributes } from '@/types/'

interface AttributeTagAttributes {
    register: UseFormRegister<CharacterFormValues>,
    inputInfos: CharacterInputInfoProps[] | undefined,
    inputMax: number,
    attrMinValues: CharacterAttributes,
    defaultValue: number,
    handleChange: Function,
    maxPoints: number,
    gastos: number,
}

/* COMPONENTS */
import PointsContainer from '@/components/PointsContainer'

// import { getStandLetters } from '@/api/config'

const Attributes = ({
    register,
    inputInfos,
    inputMax,
    attrMinValues,
    defaultValue,
    handleChange,
    maxPoints,
    gastos
}: AttributeTagAttributes) => {
    // const letters = getStandLetters()
    const [ attrPointError, setAttrPointError ] = useState<boolean>(false)

    useEffect(() => {
        setAttrPointError(gastos > maxPoints)
    }, [ gastos ])

    return <>
        <div className='points-info-container'>
            <p>Pontos Gastos <PointsContainer error={attrPointError}>{gastos}</PointsContainer></p>
            <p>Máximo <PointsContainer>{maxPoints}</PointsContainer></p>
        </div>
        {/* DIV QUE CONTÉM OS ATRIBUTOS */}
        <div className={styles.attrContainer}>
            <h3>ATRIBUTOS</h3>
            <ul className='generic-list'>
                {Children.toArray(inputInfos?.map((props) => <li>
                    {/**
                     * INPUT INFOS = {id: 'id', label: 'texto'}
                     */}
                    <label htmlFor={props.id}>{props.label}</label>
                    <input
                        type='number'
                        className={'attribute'}
                        min={attrMinValues[props.id]}
                        max={inputMax}
                        defaultValue={defaultValue}
                        id={props.id}
                        {...register(`attributes.${props.id}`, {
                            required: true,
                            valueAsNumber: true,
                            min: -2,
                            onChange: e => handleChange(e, attrMinValues[props.id]),
                        })}
                    />
                </li>
                ))}
            </ul>
        </div>
    </>
}

export default Attributes;