import { useRef, useEffect, ChangeEvent, useState, KeyboardEvent } from 'react'
import styled from 'styled-components'
import { getCookie } from 'cookies-next'

import charStyles from '@/partials/Character.module.scss'

import { saveMentalEnergy } from '@/api/character'

interface MentalEnergyProps {
    maxMentalEnergy: number,
    actualMentalEnergy: number,
    standResistence?: number,
    substandResistence?: number,
}

const MaxMentalEnergy = styled.div`
    top: 0;
    height: 30px;
    width: 100%;
    background: #303030;
`
const ActualMentalEnergyContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;
    background: #4053fd;
`

const MentalEnergy = ({ maxMentalEnergy, actualMentalEnergy, standResistence, substandResistence }: MentalEnergyProps) => {
    const actualMentalEnergyContainerRef = useRef<HTMLDivElement>(null)
    const mentalEnergyInputRef = useRef<HTMLInputElement>(null)

    const [ actualMentalEnergyState, setActualMentalEnergyState ] = useState<number>(actualMentalEnergy)

    useEffect(() => {
        let percentage
        // Área da vida
        percentage = (actualMentalEnergyState/maxMentalEnergy) * 100
        percentage = percentage<0?0:percentage>100?100:percentage
        
        if (actualMentalEnergyContainerRef.current) actualMentalEnergyContainerRef.current.style.width = `${percentage}%`

        async function save() {
            if (actualMentalEnergyState != actualMentalEnergy) await saveMentalEnergy(getCookie("charId") as string, actualMentalEnergyState)
        }
        save()
    }, [ actualMentalEnergyState ])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        if (e.key === 'Enter') {
            if (!Number(value)) return;
            if (value[0] === '+' || value[0] === '-') {
                setActualMentalEnergyState(actualMentalEnergyState + Number(value))
                e.currentTarget.value = (actualMentalEnergyState + Number(value)).toString()
                return
            }
            setActualMentalEnergyState(Number(value))
            return
        }
        if (e.key === 'ArrowUp') {
            setActualMentalEnergyState(actualMentalEnergyState + 1)
            e.currentTarget.value = (actualMentalEnergyState + 1).toString()
        }
        if (e.key === 'ArrowDown') {
            setActualMentalEnergyState(actualMentalEnergyState - 1)
            e.currentTarget.value = (actualMentalEnergyState - 1).toString()
        }
    }

    return <div>
        <h3>ENERGIA MENTAL</h3>
        <div className={charStyles.healthContainer}>
            <MaxMentalEnergy/>
            <ActualMentalEnergyContainer ref={actualMentalEnergyContainerRef}/>
            <p>
                <input
                    type="text"
                    defaultValue={actualMentalEnergyState}
                    onKeyUp={handleKeyDown}
                    ref={mentalEnergyInputRef}
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => e.target.value = actualMentalEnergyState.toString()}
                />  / {maxMentalEnergy}
            </p>
        </div>
        <ul className={charStyles.mentalButtons}>
            {standResistence && <li><button className='roll-button' onClick={() => {
                setActualMentalEnergyState(actualMentalEnergyState - (standResistence + 1))
                if (mentalEnergyInputRef.current) mentalEnergyInputRef.current.value = (actualMentalEnergyState - (standResistence + 1)).toString()
            }}>STAND</button></li>}
            <li><button className={charStyles.rollButton} onClick={() => {
                setActualMentalEnergyState(actualMentalEnergyState - 20)
                if (mentalEnergyInputRef.current) mentalEnergyInputRef.current.value = (actualMentalEnergyState - 20).toString()
            }}>PRINCIPAL</button></li>
            <li><button className={charStyles.rollButton} onClick={() => {
                setActualMentalEnergyState(actualMentalEnergyState - 15)
                if (mentalEnergyInputRef.current) mentalEnergyInputRef.current.value = (actualMentalEnergyState - 15).toString()
            }}>SECUNDÁRIA</button></li>
            { substandResistence && <li><button className='roll-button' onClick={() => {
                setActualMentalEnergyState(actualMentalEnergyState - (substandResistence + 1))
                if (mentalEnergyInputRef.current) mentalEnergyInputRef.current.value = (actualMentalEnergyState - (substandResistence + 1)).toString()
            }}>SUB-STAND</button></li> }
            <li><button className={charStyles.rollButton} onClick={() => {
                setActualMentalEnergyState(maxMentalEnergy)
                if (mentalEnergyInputRef.current) mentalEnergyInputRef.current.value = maxMentalEnergy.toString()
            }}>REGENERAR</button></li>
        </ul>
    </div>
}

export default MentalEnergy