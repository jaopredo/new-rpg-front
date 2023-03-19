import { useRef, useEffect, ChangeEvent, useState, KeyboardEvent } from 'react'
import styled from 'styled-components'
import { getCookie } from 'cookies-next'

import charStyles from '@/partials/Character.module.scss'

import { saveLife } from '@/api/character'

interface LifeProps {
    maxLife: number,
    actualLife: number
}

const MaxLife = styled.div`
    top: 0;
    height: 30px;
    width: 100%;
    background: #ff5454;
`;
const ActualLifeContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;
    background: #5dff6b;
`;

const Life = ({ maxLife, actualLife }: LifeProps) => {
    const actualLifeContainerRef = useRef<HTMLDivElement>(null)
    const lifeInputRef = useRef<HTMLInputElement>(null)

    const [ actualLifeState, setActualLifeState ] = useState<number>(actualLife)

    useEffect(() => {
        async function setData() {
            if(actualLifeState != actualLife) await saveLife(getCookie("charId") as string, actualLifeState)
        }
        setData()

        let percentage
        // Área da vida
        percentage = (actualLifeState/maxLife) * 100
        percentage = percentage<0?0:percentage>100?100:percentage
        
        if (actualLifeContainerRef.current) actualLifeContainerRef.current.style.width = `${percentage}%`
    }, [ actualLifeState ])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        if (e.key === 'Enter') {
            if (!Number(value)) return;
            if (value[0] === '+' || value[0] === '-') {
                setActualLifeState(actualLifeState + Number(value))
                e.currentTarget.value = (actualLifeState + Number(value)).toString()
                return
            }
            setActualLifeState(Number(value))
            return
        }
        if (e.key === 'ArrowUp') {
            setActualLifeState(actualLifeState + 1)
            e.currentTarget.value = (actualLifeState + 1).toString()
        }
        if (e.key === 'ArrowDown') {
            setActualLifeState(actualLifeState - 1)
            e.currentTarget.value = (actualLifeState - 1).toString()
        }
    }

    return <div>
        <h3>VIDA</h3>
        <div className={charStyles.healthContainer}>
            <MaxLife/>
            <ActualLifeContainer ref={actualLifeContainerRef}/>
            <p>
                <input
                    type="text"
                    defaultValue={actualLifeState}
                    onKeyUp={handleKeyDown}
                    ref={lifeInputRef}
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => e.target.value = actualLifeState.toString()}
                />  / {maxLife}
            </p>
        </div>
</div>
}

export default Life