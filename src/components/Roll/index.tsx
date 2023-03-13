import { Children, useEffect, useState, HTMLAttributes, MouseEventHandler } from 'react'
import styled /*{ keyframes }*/ from 'styled-components'
// import { fadeIn } from 'react-animations';

/* CSS */
import styles from './style.module.scss'

import { DiceWindowContainer, DiceContainer } from '../Containers'

import { RollConfigsProps } from '@/types/*'
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
            props.natMax?'#80ff80':props.nat1?'#f13939':'#0c0c0c'
    };
    border: ${
        props => props.maxVal?'3px solid'+"#80ff80":
            props.minVal?'3px solid'+"#f13939":'none'
    };
    width: 150px;
    height: 150px;
    font-size: 2.1em;
    border-radius: 50%;
`

const handleRollDice = (max: number) => Math.round(Math.random() * (max - 1) + 1)  // Gera número aleatório

interface DiceRollProps extends HTMLAttributes<HTMLDivElement> {
    closeRollScreen: MouseEventHandler,
    rollConfigs: RollConfigsProps
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

    return <DiceWindowContainer closeWindow={closeRollScreen}>
        <h1>RESULTADO DA ROLAGEM</h1>
        { children }
        <div className={styles.contentContainer}>
            {Children.toArray(
                rolls.map((roll: RollProps) => <span>
                    <RolledValue
                        natMax={roll.natMax}
                        nat1={roll.nat1}
                        maxVal={roll.maxVal}
                        minVal={roll.minVal}
                    >{roll.value}</RolledValue>
                    <p>({roll.originValue} + {rollConfigs.bonus ?? 0})</p>
                </span>)
            )}
        </div>
    </DiceWindowContainer>
}

export const DamageRoll = ({ children, closeRollScreen, rollConfigs }: DiceRollProps) => {
    const [ finalRoll, setFinalRoll ] = useState<RollProps>()

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

        let somatorio = 0
        rolagens.map((roll: RollProps) => {
            somatorio += roll.value
        })

        setFinalRoll({ value: somatorio })
    }, [])

    return <DiceWindowContainer closeWindow={closeRollScreen}>
        <h1>RESULTADO DA ROLAGEM</h1>
        { children }
        <div className={styles.contentContainer}>
            <span>
                <RolledValue>{finalRoll?.value}</RolledValue>
            </span>
        </div>
    </DiceWindowContainer>
}

interface BarrageRollProps {
    closeRollScreen: MouseEventHandler,
    barrageConfigs: {
        strengh: number,
        speed: number
    }
}

export const Barragem = ({ closeRollScreen, barrageConfigs }: BarrageRollProps) => {
    const calcDamage = (x: number) => x/2 + 1/2;

    const [ definitiveRoll, setDefinitiveRoll ] = useState<number>(0);
    const [ hitPunches, setHitPunches ] = useState<number>(0);
    useEffect(() => {
        let rolls = [ handleRollDice(6), handleRollDice(6) ]

        setHitPunches(rolls[0] + rolls[1] + barrageConfigs.speed)
        //   Valor final       =     1 valor           2 valor
        setDefinitiveRoll(Math.floor(hitPunches * calcDamage(barrageConfigs.strengh)));
    }, [hitPunches, barrageConfigs])

    return <DiceWindowContainer closeWindow={closeRollScreen}>
        <h1>RESULTADO DA BARRAGEM</h1>
        <div className={styles.contentContainer}>
            <RolledValue>{definitiveRoll}</RolledValue>
        </div>
        <p>SOCOS ACERTADOS {hitPunches}</p>
        <p>DANO CAUSADO POR SOCO: {calcDamage(barrageConfigs.strengh)}</p>
    </DiceWindowContainer>
}