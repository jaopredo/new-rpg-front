import { useState, useRef, useEffect, KeyboardEvent, Dispatch, SetStateAction } from 'react'
import styled from "styled-components"

import style from './style.module.scss'

/* API */
import { getMaxLevel } from '@/api/config'

/* COMPONENTS */
interface LevelProps {
    actualLevel: number,
    maxXP: number,
    actualXP: number,
    setShowLevelUpForm: Dispatch<SetStateAction<boolean>>
}

const LevelSpan = styled.span<{ levelUp: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    
    background-color: ${props => props.levelUp?'#fffd6a':'#3a3a3a'};
    color: white;
    border-radius: 50%;

    font-size: 1.5em;
    font-weight: bold;
    padding: 10px;

    width: 40px;
    height: 40px;
`

const MaxXp = styled.div`
    top: 0;
    height: 30px;
    width: 100%;
    background: #4e4e4e;
`

const ActualXpContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;
    background: #fffd6a;
`

const Level = ({ actualLevel, maxXP, actualXP, setShowLevelUpForm }: LevelProps) => {
    const actualXPInputRef = useRef()
    const actualXPContainerRef = useRef()

    const [ onMaxLevel, setOnMaxLevel ] = useState<boolean>(false)
    const [ canLevelUp, setCanLevelUp ] = useState<boolean>(false)

    const [ actualXPState, setActualXPState ] = useState<number>(actualXP)

    useEffect(() => {
        async function getData() {
            setOnMaxLevel(actualLevel == await getMaxLevel())
        }
        getData()

        setCanLevelUp(maxXP <= actualXPState)

        let percentage
        // Área da vida
        percentage = (actualXPState/maxXP) * 100
        percentage = percentage<0?0:percentage>100?100:percentage
        
        if (actualXPContainerRef.current) actualXPContainerRef.current.style.width = `${percentage}%`
    }, [ actualXPState ])

    const handleXPChange = (e: KeyboardEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget
        if (e.key === 'Enter') {
            if(!Number(value)) return
            if (value[0] === '+' || value[0] === '-') {
                setActualXPState(actualXPState + Number(value))
                e.currentTarget.value = (actualXPState + Number(value)).toString()
                return
            }
            setActualXPState(Number(value))
            e.currentTarget.value = value
        }
        if (e.key === 'ArrowUp') {
            setActualXPState(actualXPState+1)
            e.currentTarget.value = (actualXPState+1).toString()
        }
        if (e.key === 'ArrowDown') {
            setActualXPState(actualXPState-1)
            e.currentTarget.value = (actualXPState-1).toString()
        }
    }

    return <div className={style.levelSpanContainer}>
        <LevelSpan levelUp={canLevelUp}>{actualLevel}</LevelSpan>
        <div className={style.levelContainer}>
            <MaxXp/>
            <ActualXpContainer ref={actualXPContainerRef}/>
            <div className={style.levelXp}>
                { onMaxLevel?'NÍVEL MÁXIMO':<>
                    <input
                        type='text'
                        defaultValue={actualXP}
                        ref={actualXPInputRef}
                        onBlur={e => e.target.value = actualXPState.toString()}
                        onKeyUp={handleXPChange}
                        maxLength={4}
                        className={style.actualLevel}
                    />/{maxXP}
                </>}
            </div>
        </div>
        { !onMaxLevel && <button
            type='button'
            disabled={!canLevelUp}
            onClick={()=>setShowLevelUpForm(true)}
        >EVOLUIR</button> }
    </div>
}

export default Level