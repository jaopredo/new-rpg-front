import { useState, useEffect, Children, MouseEvent, MouseEventHandler } from 'react'

import sheetStyle from '@/sass/Sheet.module.scss'
import standStyles from './Stand.module.scss'

/* API */
import { getStandLetters } from '@/api/config'
import { standAttributesTranslate, abilitysNamesTranslate, standTypesTranslate } from 'src/func/translate'

/* TYPES */
import { StandFormValues, StandAttributes, StandAbility, StandType, SubstandType } from '@/types/stand'
import { RollConfigsProps } from '@/types/index'

/* COMPONENTS */
import { StandContainer, AttrContainer, ImageContainer } from '@/components/Containers'
import { DoneHab } from '@/components/Ability'
import { returnRollConfigsByString } from '../func'
import ImageForm from '@/components/ImageForm'

interface StandProps extends StandFormValues {
    roll: (configs: RollConfigsProps) => void,
    barrage: (configs: { strengh: number, speed: number }) => void
}

interface PartialStandProps {
    stand: Required<StandType>,
    substand: Required<SubstandType>,
    letters: string,
    handleAttrClick: (e: MouseEvent<HTMLInputElement>, bonus: number) => void,
    rollDice: MouseEventHandler<HTMLInputElement>,
    barrage: (configs: { strengh: number, speed: number }) => void
}

interface ActProps {
    img?: string,
    attributes: StandAttributes,
    ability: StandAbility,
    handleAttrClick: (e: MouseEvent<HTMLInputElement>, bonus: number) => void,
    letters: string,
    num: string,
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

interface SubstandProps extends Omit<PartialStandProps, 'stand'> {
    letters: string
}

const Substand = ({ substand, rollDice, handleAttrClick, barrage, letters }: SubstandProps) => {
    const { basic: substandBasic, attributes: substandAttributes, combat: substandCombat, move: substandMove, ability: substandAbility } = substand

    return <div className={standStyles.substandArea}>
        <h2>Sub-stand</h2>
        <div className={standStyles.basicArea}>
            <h1 className={sheetStyle.name}>{substandBasic.name}</h1>
            <ul className={sheetStyle.infosContainer}>
                <li>Tipo: <strong>{standTypesTranslate[substandBasic.standType]}</strong></li>
                <li>Ponto Fraco: <strong>{substandBasic.weakPoint}</strong></li>
            </ul>
        </div>
        <ul className={standStyles.subContainer}>
            { Children.toArray((Object.keys(substandAttributes) as Array<keyof typeof substandAttributes>).map(
                attr => <li>
                    <p>{standAttributesTranslate[attr]}</p>
                    <input
                        type='text'
                        readOnly
                        className={sheetStyle.spanContainer}
                        defaultValue={letters[substand.attributes[attr]]}
                        onClick={e => handleAttrClick(e, substandCombat.bonus)}
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
                    defaultValue={`1D${substandCombat.damage}`}
                    onClick={rollDice}
                />
            </li>
            <li>
                <p>ARMADURA</p>
                <span className={sheetStyle.spanContainer}>{ substandCombat.shield }</span>
            </li>
            <li>
                <p>BÔNUS</p>
                <span className={sheetStyle.spanContainer}>{ substandCombat.bonus }</span>
            </li>
        </ul>
        <h2>Mov.</h2>
        <ul className={standStyles.subContainer}>
            <li>
                <p>ALCANCE</p>
                <span className={sheetStyle.spanContainer}>{ substandMove.range }</span>
            </li>
            <li>
                <p>MOVIMENTO</p>
                <span className={sheetStyle.spanContainer}>{ substandMove.movement }</span>
            </li>
            <li>
                <p>STAND JUMP</p>
                <span className={sheetStyle.spanContainer}>{ substandMove.standJump }</span>
            </li>
        </ul>
        <h2>Habilidade</h2>
        <div className={standStyles.substandAbilityContainer}>
            <button className={sheetStyle.rollButton} onClick={() => barrage({ strengh: substandAttributes.strengh, speed: substandAttributes.speed })}>BARRAGEM</button>
            <DoneHab title='PRINCIPAL' infos={substandAbility} rollDice={rollDice} />
        </div>
        <h2>Imagem</h2>
        {!substandBasic.img && <div className={standStyles.imageFormContainer}>
            <ImageForm type="substand" substandId={substand._id} />
        </div>}
        <ImageContainer src={substandBasic.img ?? ''}/>
    </div>
}

const NormalStand = ({ stand, substand, letters, handleAttrClick, rollDice, barrage }: PartialStandProps) => {
    const { attributes: standAttributes, combat: standCombat, move: standMove, abilitys: standAbilitys } = stand    

    return <>
        <div className={sheetStyle.attributesArea}>
            <AttrContainer bgImg={stand.basic.img} className={sheetStyle.attrContainer}>
                {!stand.basic.img && <ImageForm type="stand" standId={stand._id} />}
                <ul>
                    {Children.toArray((Object.keys(standAttributes) as Array<keyof typeof standAttributes>)?.map(id => <li>
                        <label htmlFor={id}>{standAttributesTranslate[id]}</label>
                        <input
                            type='text'
                            className={'attribute'}
                            readOnly
                            id={id}
                            onClick={e => handleAttrClick(e, standCombat.bonus)}
                            value={letters[stand.attributes?.[id]]}
                        />
                    </li>))}
                </ul>
            </AttrContainer>
        </div>
        <div className={standStyles.battleArea}>
            <h2>Batalha</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>DANO</p>
                    <input
                        className={sheetStyle.spanContainer}
                        readOnly
                        defaultValue={`1D${standCombat.damage}`}
                        onClick={rollDice}
                    />
                </div>
                <div>
                    <p>ARMADURA</p>
                    <span className={sheetStyle.spanContainer}>{ standCombat.shield }</span>
                </div>
                <div>
                    <p>BÔNUS</p>
                    <span className={sheetStyle.spanContainer}>{ standCombat.bonus }</span>
                </div>
            </div>
        </div>
        {substand && <Substand
            substand={substand}
            letters={letters}
            handleAttrClick={handleAttrClick}
            rollDice={rollDice}
            barrage={barrage}
        />}
        <div className={sheetStyle.movimentArea}>
            <h2>Movimento</h2>
            <div className={standStyles.infosContainer}>
                <div>
                    <p>ALCANCE</p>
                    <span className={sheetStyle.spanContainer}>{ standMove.range }</span>
                </div>
                <div>
                    <p>APR</p>
                    <span className={sheetStyle.spanContainer}>{ standMove.apr }</span>
                </div>
                <div>
                    <p>MOVIMENTO</p>
                    <span className={sheetStyle.spanContainer}>{ standMove.movement }</span>
                </div>
            </div>
        </div>
        <div className={standStyles.abilitysArea}>
            <h2>Habilidades</h2>
            <div className={standStyles.infosContainer}>
                <p>STAND JUMP</p>
                <span className={sheetStyle.spanContainer}>{ stand?.move.standJump }</span>
            </div>
            <button className={sheetStyle.rollButton} onClick={() => barrage({ strengh: standAttributes?.strengh, speed: standAttributes?.speed })}>BARRAGEM</button>
            <div className={standStyles.abilitys}>
                {Children.toArray((Object.keys(standAbilitys ?? {}) as Array<keyof typeof standAbilitys>).map(
                    name => standAbilitys[name]?.name && <DoneHab title={abilitysNamesTranslate[name]} rollDice={rollDice} infos={standAbilitys[name]} />
                ))}
            </div>
        </div>
    </>
}


const Act = ({ attributes, ability, combat, move, barrage, handleAttrClick, letters, num, rollDice, img }: ActProps) => {
    return <div className={standStyles.act}>
        <h2>ATO {num}</h2>
        <div className={sheetStyle.attributesArea}>
            <AttrContainer bgImg={img} className={sheetStyle.attrContainer}>
                {!img && <h3>ATRIBUTOS</h3>}
                <ul>
                    {Children.toArray((Object.keys(attributes) as Array<keyof typeof attributes>)?.map(id => <li>
                        <label htmlFor={`act${num}-${id}`}>{standAttributesTranslate[id]}</label>
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
            </AttrContainer>
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
    const { acts } = stand
    return <div className={standStyles.actsArea}>
        {Children.toArray((Object.keys(acts) as Array<keyof typeof acts>).map(
            (act) => <Act num={act[3]} barrage={barrage} {...acts[act]} rollDice={rollDice} letters={letters} handleAttrClick={handleAttrClick} />)
        )}
    </div>
}


const Stand = ({ roll, stand, substand, barrage }: StandProps) => {
    const letters: string = getStandLetters()

    const [ isActStand, setIsActStand ] = useState<boolean>(false)

    useEffect(() => {
        setIsActStand(stand?.basic.standType == "act")
    }, [])

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
        <div className={sheetStyle.basicArea}>
            <h1 className={sheetStyle.name}>{stand?.basic.name}</h1>
            <ul className={sheetStyle.infosContainer}>
                <li>Tipo: <strong>{standTypesTranslate[stand?.basic.standType]}</strong></li>
                <li>Ponto Fraco: <strong>{stand?.basic.weakPoint}</strong></li>
            </ul>
        </div>
        {!isActStand && <NormalStand
            stand={stand as Required<StandType>}
            substand={substand as Required<SubstandType>}
            rollDice={rollDice}
            handleAttrClick={handleAttrClick}
            letters={letters}
            barrage={barrage}
        />}
        {isActStand && <ActStand
            stand={stand as Required<StandType>}
            substand={substand as Required<SubstandType>}
            rollDice={rollDice}
            handleAttrClick={handleAttrClick}
            letters={letters}
            barrage={barrage}
        />}
    </StandContainer>
}

export default Stand