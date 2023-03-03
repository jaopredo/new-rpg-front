import { useRef, useEffect, ChangeEvent, useState, KeyboardEvent } from 'react'
import styled from 'styled-components'

import charStyles from '@/partials/Character.module.scss'
import styles from './style.module.scss'

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
    const actualLifeContainerRef = useRef()
    const lifeInputRef = useRef()

    const [ actualLifeState, setActualLifeState ] = useState<number>(actualLife)

    useEffect(() => {
        let percentage;
        // Área da vida
        if (actualLife && lifeInputRef.current) lifeInputRef.current.value = actualLife;
        percentage = (actualLife/maxLife) * 100;
        percentage = percentage<0?0:percentage>100?100:percentage;
        document.getElementById('actual-life').style.width = `${percentage}%`;
    }, [])

    const handleHealthKeyDown = (e: KeyboardEvent<HTMLInputElement>, action: string) => {
        const { value } = e.currentTarget;
        if (e.key === 'Enter') {
            if (!Number(value)) return;
            if (value[0] === '+' || value[0] === '-') {
                if (action === 'life') setActualLifeState(actualLifeState + Number(value));
                // if (action === 'mental-energy') setActualMentalEnergy(actualMentalEnergy + Number(value));
                return;
            }
            if (action === 'life') setActualLifeState(Number(value));
            // if (action === 'mental-energy') setActualMentalEnergy(Number(value));
            return;
        }
        if (e.key === 'ArrowUp') {
            if (action === 'life') setActualLifeState(actualLifeState+1);
            // if (action === 'mental-energy') setActualMentalEnergy(actualMentalEnergy+1);
        }
        if (e.key === 'ArrowDown') {
            if (action === 'life') setActualLifeState(actualLifeState-1);
            // if (action === 'mental-energy') setActualMentalEnergy(actualMentalEnergy-1);
        }
    }

    return <div className={styles.life}>
        <h3>VIDA</h3>
        <div className={charStyles.healthContainer}>
            <MaxLife/>
            <ActualLifeContainer ref={actualLifeContainerRef} id='actual-life'/>
            <p>
                <input
                    type="text"
                    defaultValue={actualLifeState}
                    onKeyUp={handleHealthKeyDown}
                    ref={lifeInputRef}
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => e.target.value = actualLifeState.toString()}
                />  / {maxLife}
            </p>
        </div>
</div>
}

export default Life;