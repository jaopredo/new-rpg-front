import { Children, useRef, useEffect, useState } from 'react'
import { GoVerified } from 'react-icons/go'
import Image from 'next/image'

import charStyles from './Character.module.scss'
import sheetStyles from '@/sass/Sheet.module.scss'

/* IMAGES */
import RpgDices from '@/images/dice-vector.png'

/* API */
import { getCharSpecialitys } from '@/api/config'

/* COMPONENTS */
import { CharContainer } from '@/components/Containers'
import Life from '@/components/Life'
import MentalEnergy from '@/components/MentalEnergy'
import Level from '@/components/Level'

/* TYPES */
import { CharacterFormValues, RollConfigsProps } from '@/types/';
import LevelUpForm from '@/components/LevelUpForm'

interface CharacterProps extends CharacterFormValues {
    roll: (configs: RollConfigsProps) => void
}

const Character = ({ roll, basic, attributes, specialitys, combat, level }: CharacterProps) => {
    const [ showLevelUpForm, setShowLevelUpForm ] = useState<boolean>()

    const [ advantages, setAdvantages ] = useState<number>(0)
    const [ disadvantages, setDisadvantages ] = useState<number>(0)

    const specInfos = useRef()

    useEffect(() => {
        async function getData() {
            specInfos.current = await getCharSpecialitys()
        }
        getData()
    }, [])

    return <CharContainer>
        <div className={sheetStyles.basicArea}>
            <h1 className={sheetStyles.name}>{basic?.name}</h1>
            <ul className={sheetStyles.infosContainer}>
                <li>Raça: <strong>{basic?.race}</strong></li>
                <li>Idade: <strong>{basic?.age}</strong></li>
                <li>Profissão: <strong>{basic?.occupation}</strong></li>
                <li>Estilo de Luta: <strong>{basic?.fightStyle}</strong></li>
            </ul>
        </div>
        <div className={sheetStyles.attributesArea}>
            <ul className={charStyles.advantagesList}>
                <li>
                    <label htmlFor="vantagens">Vantagens: </label>
                    <input type="number" className={charStyles.vantagens} onChange={e => setAdvantages(Number(e.target.value))} defaultValue={0} min={0} id="vantagens" />
                </li>
                <li>
                    <label htmlFor="desvantagens">Desvantagens: </label>
                    <input type="number" className={charStyles.desvantagens} onChange={e => setDisadvantages(Number(e.target.value))} defaultValue={0} min={0} id="desvantagens" />
                </li>
            </ul>
            <div className={sheetStyles.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul className='generic-list'>
                    {Children.toArray(Object.keys(attributes)?.map((id: string) => <li>
                        {/**
                         * INPUT INFOS = {id: 'id', label: 'texto'}
                         */}
                        <label htmlFor={id}>{id}</label>
                        <input
                            type='number'
                            className={'attribute'}
                            readOnly
                            defaultValue={1}
                            id={id}
                            onClick={() => roll({
                                faces: 20,
                                times: 1 + (advantages - disadvantages) ** 2 ** 1/2,
                                bonus: Math.floor(attributes[id] / 2),
                                advantage: advantages > disadvantages,
                                disadvantage: disadvantages > advantages
                            })}
                            value={attributes[id]}
                        />
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className={sheetStyles.specsFieldset}>
            <h2>Especialidades</h2>
            <table>
                <thead>
                    <tr><th>Nome</th><th>Check</th></tr>
                </thead>
                {Children.toArray(Object.keys(specInfos.current ?? []).map(
                    area => <tbody className={`${area}-container`}>
                        {Children.toArray(specInfos.current?.[area].map(props => 
                            <tr onClick={() => {
                                if (!!specialitys?.[area][props.id]) roll({
                                    faces: 20,
                                    times: 1 + (advantages - disadvantages) ** 2 ** 1/2,
                                    bonus: Math.floor(attributes[area] / 2) + 5,
                                    advantage: advantages > disadvantages,
                                    disadvantage: disadvantages > advantages
                                })
                            }} className={`${props.area} ${specialitys?.[area][props.id]&&'have-spec'}`}>
                                <td>{props.label}</td>
                                <td><GoVerified style={{
                                    opacity: Number(!!specialitys?.[area][props.id])
                                }}/></td>
                            </tr>
                        ))}
                    </tbody>
                ))}
            </table>
        </div>
        <div className={charStyles.healthArea}>
            <h2>Saúde</h2>
            {combat.actualLife && <Life
                actualLife={combat.actualLife}
                maxLife={combat.life}
            />}
            {combat.actualMentalEnergy && <MentalEnergy
                actualMentalEnergy={combat.actualMentalEnergy}
                maxMentalEnergy={combat.mentalEnergy}
            />}
        </div>
        <div className={charStyles.movimentArea}>
            <h2>Mov.</h2>
            <p className={charStyles.charMove}>{combat.movement}m</p>
        </div>
        <div className={charStyles.defendArea}>
            <h2>Defesa</h2>
            <div className={charStyles.defendContainer}>
                <div className={charStyles.caArea}>
                    <div>DA<span className={sheetStyles.spanContainer}>{ combat?.da }</span></div>
                </div>
                <div className={charStyles.shieldArea}>
                    <label htmlFor="shield">ARMADURA</label><input
                        className={sheetStyles.spanContainer}
                        type='number'
                        defaultValue={0}
                    />
                </div>
            </div>
        </div>
        <div className={charStyles.reactionsArea}>
            <h2>Reações</h2>
            <div className={charStyles.reactionsContainer}>
                <button type="button" className={charStyles.rollButton} onClick={() => roll({
                    faces: 20,
                    times: 1,
                    bonus: Math.floor(Number(attributes.strengh) / 2) + (!!specialitys.strengh.fight?5:0),
                })}>CONTRA-ATAQUE</button>
                <button type="button" className={charStyles.rollButton} onClick={e => roll({
                    faces: basic.fightStyle === "fighter"?6:4,
                    times: 1,
                    bonus: Math.floor(Number(attributes.strengh) / (basic.fightStyle==='fighter'?1:2)),
                    advantage: true,
                })
                }>SOCO</button>
            </div>
        </div>
        <div className={charStyles.levelArea}>
            <h2>Level</h2>
            {level.actualLevel && <Level setShowLevelUpForm={setShowLevelUpForm} {...level} />}
        </div>
        <div className={charStyles.dicesArea}>
            <h2>Dados</h2>
            <Image src={RpgDices} alt="imagens dos dados" useMap='#rpg-dices' />
            <map name="rpg-dices">
                <area onClick={() => roll({ faces: 100, times: 1 })} alt="1d100" title="1d100" href="#dices-area" coords="42,44,25" shape="circle"/>
                <area onClick={() => roll({ faces: 10, times: 1 })} alt="1d10" title="1d10" href="#dices-area" coords="101,43,24" shape="circle"/>
                <area onClick={() => roll({ faces: 12, times: 1 })} alt="1d12" title="1d12" href="#dices-area" coords="160,41,29" shape="circle"/>
                <area onClick={() => roll({ faces: 20, times: 1 })} alt="1d20" title="1d20" href="#dices-area" coords="228,39,24" shape="circle"/>
                <area onClick={() => roll({ faces: 4, times: 1 })} alt="1d4" title="1d4" href="#dices-area" coords="65,104,24" shape="circle"/>
                <area onClick={() => roll({ faces: 6, times: 1 })} alt="1d6" title="1d6" href="#dices-area" coords="143,106,23" shape="circle"/>
                <area onClick={() => roll({ faces: 8, times: 1 })} alt="1d8" title="1d8" href="#dices-area" coords="212,106,21" shape="circle"/>
            </map>
        </div>
        { showLevelUpForm && <LevelUpForm attributes={attributes} specialitys={specialitys} closeWindow={() => setShowLevelUpForm(false)} /> }
    </CharContainer>
}

export default Character;