import { useState, useEffect, Children, MouseEvent, MouseEventHandler } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import sheetStyle from '@/sass/Sheet.module.scss'
import standStyles from './Stand.module.scss'

/* API */
import { getStandLetters } from '@/api/config'

/* TYPES */
import { StandFormValues, RollConfigsProps, StandAttributes, StandAbility } from '../types'

/* COMPONENTS */
import { StandContainer } from '@/components/Containers'
import { DoneHab } from '@/components/Ability'
import { returnRollConfigsByString } from '../func'

interface StandProps extends StandFormValues {
    roll: (configs: RollConfigsProps) => void,
    barrage: (configs: { strengh: number, speed: number }) => void
}

interface PartialStandProps extends StandFormValues {
    attributes: {
        strengh: string,
        speed: string,
        durability: string,
        precision: string,
        range: string,
        development: string
    },
    nomesHabilidades: {
        firstMain: string,
        secondMain: string,
        passive: string
    },
    standTypes: {
        'short-range': string,
        'long-range': string,
        'automatic': string,
        'independent': string,
        'colony': string,
        'act': string,
        'object': string,
        'union': string,
        'ability': string,
        'sharing': string,
    },
    letters: string,
    handleAttrClick: (e: MouseEvent<HTMLInputElement>, bonus: number) => void,
    rollDice: MouseEventHandler<HTMLInputElement>,
    barrage: (configs: { strengh: number, speed: number }) => void
}

interface ActProps {
    img: string,
    attributes: StandAttributes,
    ability: StandAbility,
    handleAttrClick: (e: MouseEvent<HTMLInputElement>, bonus: number) => void,
    letters: string,
    num: number,
    rollDice: MouseEventHandler<HTMLInputElement>,
    barrage: (configs: { strengh: number, speed: number }) => void,
    combat: {
        damage: number,
        shield: number,
        bonus: number
    },
    move: {
        range: string,
        apr: number,
        movement: string,
        standJump: string
    }
}


const NormalStand = ({ stand, substand, attributes, nomesHabilidades, letters, standTypes, handleAttrClick, rollDice, barrage }: PartialStandProps) => {
    return <>
        <div className={sheetStyle.attributesArea}>
            <div className={sheetStyle.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul>
                    {Children.toArray(Object.keys(stand.attributes ?? [])?.map((id: string) => <li>
                        <label htmlFor={id}>{attributes[id]}</label>
                        <input
                            type='text'
                            className={'attribute'}
                            readOnly
                            id={id}
                            onClick={handleAttrClick}
                            value={letters[stand.attributes?.[id]]}
                        />
                    </li>))}
                </ul>
            </div>
        </div>
        <div className={standStyles.battleArea}>
            <h2>Batalha</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>DANO</p>
                    <input
                        className={sheetStyle.spanContainer}
                        readOnly
                        defaultValue={`1D${stand?.combat.damage}`}
                        onClick={rollDice}
                    />
                </div>
                <div>
                    <p>ARMADURA</p>
                    <span className={sheetStyle.spanContainer}>{ stand?.combat.shield }</span>
                </div>
                <div>
                    <p>BÔNUS</p>
                    <span className={sheetStyle.spanContainer}>{ stand?.combat.bonus }</span>
                </div>
            </div>
        </div>
        <div className={standStyles.substandArea}>
            <h2>Sub-stand</h2>
            <div className={standStyles.basicArea}>
                <h1 className={sheetStyle.name}>{substand?.basic.name}</h1>
                <ul className={sheetStyle.infosContainer}>
                    <li>Tipo: <strong>{standTypes[substand?.basic.standType]}</strong></li>
                    <li>Ponto Fraco: <strong>{substand?.basic.weakPoint}</strong></li>
                </ul>
            </div>
            <ul className={standStyles.subContainer}>
                { Children.toArray(Object.keys(substand.attributes ?? {}).map(
                    attr => <li>
                        <p>{attributes[attr]}</p>
                        <input
                            type='text'
                            readOnly
                            className={sheetStyle.spanContainer}
                            defaultValue={letters[substand.attributes[attr]]}
                            onClick={e => handleAttrClick(e)}
                        />
                    </li>
                )) }
            </ul>
            <h2>Batalha</h2>
            <ul className={standStyles.subContainer}>
                <li>
                    <p>DANO</p>
                    <input
                        className={sheetStyle.spanContainer}
                        readOnly
                        defaultValue={`1D${substand?.combat.damage}`}
                        onClick={rollDice}
                    />
                </li>
                <li>
                    <p>ARMADURA</p>
                    <span className={sheetStyle.spanContainer}>{ substand?.combat.shield }</span>
                </li>
                <li>
                    <p>BÔNUS</p>
                    <span className={sheetStyle.spanContainer}>{ substand?.combat.bonus }</span>
                </li>
            </ul>
            <h2>Mov.</h2>
            <ul className={standStyles.subContainer}>
                <li>
                    <p>ALCANCE</p>
                    <span className={sheetStyle.spanContainer}>{ substand?.move.range }</span>
                </li>
                <li>
                    <p>MOVIMENTO</p>
                    <span className={sheetStyle.spanContainer}>{ substand?.move.movement }</span>
                </li>
                <li>
                    <p>STAND JUMP</p>
                    <span className={sheetStyle.spanContainer}>{ substand?.move.standJump }</span>
                </li>
            </ul>
            <h2>Habilidade</h2>
            <div className={standStyles.substandAbilityContainer}>
                <button className={sheetStyle.rollButton} onClick={() => barrage({ strengh: substand.attributes?.strengh, speed: substand.attributes?.speed })}>BARRAGEM</button>
                <DoneHab title='PRINCIPAL' infos={substand?.ability} className='substand-done-ability' rollDice={rollDice} />
            </div>
        </div>
        <div className={sheetStyle.movimentArea}>
            <h2>Movimento</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>ALCANCE</p>
                    <span className={sheetStyle.spanContainer}>{ stand?.move.range }</span>
                </div>
                <div>
                    <p>APR</p>
                    <span className={sheetStyle.spanContainer}>{ stand?.move.apr }</span>
                </div>
                <div>
                    <p>MOVIMENTO</p>
                    <span className={sheetStyle.spanContainer}>{ stand?.move.movement }</span>
                </div>
            </div>
        </div>
        <div className={standStyles.abilitysArea}>
            <h2>Habilidades</h2>
            <div className={standStyles.infosContainer}>
                <p>STAND JUMP</p>
                <span className={sheetStyle.spanContainer}>{ stand?.move.standJump }</span>
            </div>
            <button className={sheetStyle.rollButton} onClick={() => barrage({ strengh: stand.attributes?.strengh, speed: stand.attributes?.speed })}>BARRAGEM</button>
            <div className={standStyles.abilitys}>
                {Children.toArray(Object.keys(stand.abilitys ?? {}).map(
                    name => stand.abilitys[name].name && <DoneHab title={nomesHabilidades[name]} rollDice={rollDice} infos={stand.abilitys[name]} />
                ))}
            </div>
        </div>
    </>
}



const Act = ({ attributes, ability, combat, move, barrage, handleAttrClick, letters, num, rollDice }: ActProps) => {
    return <div className={standStyles.act}>
        <h2>ATO {num}</h2>
        <div className={sheetStyle.attributesArea}>
            <div className={sheetStyle.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul>
                    {Children.toArray(Object.keys(attributes ?? [])?.map((id: string) => <li>
                        <label htmlFor={`act${num}-${id}`}>{id}</label>
                        <input
                            type='text'
                            className={'attribute'}
                            readOnly
                            id={`act${num}-${id}`}
                            onClick={(e) => handleAttrClick(e, combat.bonus)}
                            value={letters[attributes?.[id]]}
                        />
                    </li>))}
                </ul>
            </div>
        </div>
        <div className={standStyles.battleArea}>
            <h2>Batalha</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>DANO</p>
                    <input
                        className={sheetStyle.spanContainer}
                        readOnly
                        defaultValue={`1D${combat.damage}`}
                        onClick={rollDice}
                    />
                </div>
                <div>
                    <p>ARMADURA</p>
                    <span className={sheetStyle.spanContainer}>{ combat.shield }</span>
                </div>
                <div>
                    <p>BÔNUS</p>
                    <span className={sheetStyle.spanContainer}>{ combat.bonus }</span>
                </div>
            </div>
        </div>
        <div className={sheetStyle.movimentArea}>
            <h2>Movimento</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>ALCANCE</p>
                    <span className={sheetStyle.spanContainer}>{ move.range }</span>
                </div>
                <div>
                    <p>APR</p>
                    <span className={sheetStyle.spanContainer}>{ move.apr }</span>
                </div>
                <div>
                    <p>MOVIMENTO</p>
                    <span className={sheetStyle.spanContainer}>{ move.movement }</span>
                </div>
            </div>
        </div>
        <div className={standStyles.abilitysArea}>
            <h2>Habilidades</h2>
            <div className={standStyles.infosContainer}>
                <p>STAND JUMP</p>
                <span className={sheetStyle.spanContainer}>{ move.standJump }</span>
            </div>
            <button className={sheetStyle.rollButton} onClick={() => barrage({ strengh: attributes.strengh, speed: attributes.speed })}>BARRAGEM</button>
            <DoneHab title='HABILIDADE' rollDice={rollDice} infos={ability}/>
        </div>
    </div>
}

const ActStand = ({ stand, letters, handleAttrClick, rollDice, barrage }: PartialStandProps) => {
    return <div className={standStyles.actsArea}>
        {Children.toArray([1, 2, 3, 4].map(
            (act) => <Act num={act} barrage={barrage} {...stand?.acts?.[`act${act}`]} rollDice={rollDice} letters={letters} handleAttrClick={handleAttrClick} />)
        )}
    </div>
}


const Stand = ({ roll, stand, substand, barrage }: StandProps) => {
    const letters: string = getStandLetters()
    // Funções de Tradução
    const standTypes = {
        'short-range': 'Curto Alcance',
        'long-range': 'Longo Alcance',
        'automatic': 'Automático',
        'independent': 'Independente',
        'colony': 'Colônia',
        'act': 'Ato',
        'object': 'Objeto',
        'union': 'União',
        'ability': 'Habilidade',
        'sharing': 'Compartilhado',
    }
    const attributes = {
        strengh: 'FORÇA',
        speed: 'VELOCIDADE',
        durability: 'DURABILIDADE',
        precision: 'PRECISÃO',
        range: 'ALCANCE',
        development: 'P.D'
    }
    const nomesHabilidades = {
        firstMain: "PRINCIPAL",
        secondMain: "SECUNDÁRIA",
        passive: "PASSIVA"
    }

    const [ haveStand, setHaveStand ] = useState<boolean>(false)
    const [ isActStand, setIsActStand ] = useState<boolean>(false)

    useEffect(() => {
        setHaveStand(!!stand)
        setIsActStand(stand.basic.standType == "act")
    }, [ stand ])

    const rollDice = (e: MouseEvent<HTMLInputElement>) => {
        roll({
            ...returnRollConfigsByString(e.currentTarget.value),
            action: "damage"
        })
    }


    const handleAttrClick = (e: MouseEvent<HTMLInputElement>, bonus: number) => {
        const { value } = e.currentTarget

        const facesNumber = (x: number) => Math.floor(x**2/2 - 3*x + 6) - 1
        const times = letters.indexOf(value)>0?facesNumber(letters.indexOf(value))+1:0
        roll({
            faces: 20,
            times,
            advantage: letters.indexOf(value) > 3,
            disadvantage: letters.indexOf(value) < 3,
            action: "roll",
            bonus: bonus
        })
    }


    return <StandContainer acts={isActStand}>
        { !haveStand && <div>
            NENHUM STAND ENCONTRADO, DESEJA <Link href='/register-stand'>CRIAR UM NOVO STAND?</Link>
        </div> }
        { haveStand && <>
            <div className={sheetStyle.basicArea}>
                <h1 className={sheetStyle.name}>{stand?.basic.name}</h1>
                <ul className={sheetStyle.infosContainer}>
                    <li>Tipo: <strong>{standTypes[stand?.basic.standType]}</strong></li>
                    <li>Ponto Fraco: <strong>{stand?.basic.weakPoint}</strong></li>
                </ul>
            </div>
            {!isActStand && <NormalStand
                stand={stand}
                substand={substand}
                rollDice={rollDice}
                nomesHabilidades={nomesHabilidades}
                attributes={attributes}
                handleAttrClick={handleAttrClick}
                letters={letters}
                standTypes={standTypes}
                barrage={barrage}
            />}
            {isActStand && <ActStand
                stand={stand}
                substand={substand}
                rollDice={rollDice}
                nomesHabilidades={nomesHabilidades}
                attributes={attributes}
                handleAttrClick={handleAttrClick}
                letters={letters}
                standTypes={standTypes}
                barrage={barrage}
            />}
        </> }
    </StandContainer>
}

export default Stand