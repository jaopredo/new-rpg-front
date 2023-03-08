import React, { useEffect, useState, HTMLAttributes, MouseEventHandler } from 'react'
import styled /*{ keyframes }*/ from 'styled-components'
// import { fadeIn } from 'react-animations';

/* CSS */
import styles from './style.module.scss'

import { WindowContainer } from '../Containers'

interface RollProps {
    natMax?: boolean,
    minVal?: boolean,
    maxVal?: boolean,
    nat1?: boolean,
    originValue?: number,
    value?: number
}

const RolledValue = styled.div<RollProps>`
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${
        props =>
            props.natMax?'#80ff80':props.nat1?'#f13939':'#252525fc'
    };
    border: ${
        props => props.maxVal?'3px solid'+"#80ff80":
            props.minVal?'3px solid'+"#f13939":'none'
    };
    width: 100px;
    height: 100px;
    font-size: 1.9em;
    border-radius: 50%;
`;
const DiceContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const handleRollDice = (max: number) => Math.round(Math.random() * (max - 1) + 1)  // Gera número aleatório

interface DiceRollProps extends HTMLAttributes<HTMLDivElement> {
    closeRollScreen: MouseEventHandler,
    rollConfigs: {
        faces: number,
        times: number,
        bonus?: number,
        advantage?: boolean,
        disadvantage?: boolean
    }
}


function getMinValue(arr: Array<number>) {
    return Math.min(...arr)
}

function getMaxValue(arr: Array<number>) {
    return Math.max(...arr)
}


export const DiceRoll = ({ children, closeRollScreen, rollConfigs }: DiceRollProps) => {
    const [ rolls, setRolls ] = useState<RollProps[]>([])

    useEffect(() => {
        let rolagens = []
        let rolledValues = []
        for (let i = 0; i < rollConfigs.times; i++) {
            let value = handleRollDice(rollConfigs.faces)
            rolledValues.push(value + (rollConfigs.bonus ?? 0))
            rolagens.push({
                originValue: value,
                value: value + (rollConfigs.bonus ?? 0),
                nat1: value == 1,
                natMax: value == rollConfigs.faces,
            })
        }

        const minValue = getMinValue(rolledValues)
        const maxValue = getMaxValue(rolledValues)
        const definitiveRolls: RollProps[] = rolagens.map((roll: RollProps) => {
            if (rollConfigs.disadvantage && roll.value === minValue) roll.minVal = true
            if (rollConfigs.advantage && roll.value == maxValue) roll.maxVal = true
            return roll
        })

        setRolls(definitiveRolls)
    }, [])

    return <WindowContainer closeWindow={closeRollScreen}>
        <h1>RESULTADO DA ROLAGEM</h1>
        { children }
        <div className={styles.contentContainer}>
            { React.Children.toArray(
                rolls.map((roll: RollProps) => <DiceContainer>
                    <RolledValue
                        natMax={roll.natMax}
                        nat1={roll.nat1}
                        maxVal={roll.maxVal}
                        minVal={roll.minVal}
                    >{roll.value}</RolledValue>
                    ({roll.originValue} + {rollConfigs.bonus ?? 0})
                </DiceContainer>)
            ) }
        </div>
    </WindowContainer>;
}