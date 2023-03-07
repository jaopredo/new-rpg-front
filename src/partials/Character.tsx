import { Children, useRef, useEffect } from 'react'
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
import { CharacterFormValues } from '@/types/';

const Character = ({ basic, attributes, specialitys, combat, level }: CharacterFormValues) => {
    const specInfos = useRef()

    useEffect(() => {
        async function getData() {
            specInfos.current = await getCharSpecialitys()
        }
        console.log(combat)
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
                    <input type="number" defaultValue={0} min={0} id="vantagens" />
                </li>
                <li>
                    <label htmlFor="desvantagens">Desvantagens: </label>
                    <input type="number" defaultValue={0} min={0} id="desvantagens" />
                </li>
            </ul>
            <div className={sheetStyles.attrContainer}>
                <h3>ATRIBUTOS</h3>
                <ul className='generic-list'>
                    {Children.toArray(Object.keys(attributes)?.map((id) => <li>
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
                        {Children.toArray(specInfos.current[area].map(props => 
                            <tr className={`${props.area} ${specialitys?.[area][props.id]&&'have-spec'}`}>
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
                actualLife={combat?.actualLife}
                maxLife={combat?.life}
            />}
            {combat.actualMentalEnergy && <MentalEnergy
                actualMentalEnergy={combat?.actualMentalEnergy}
                maxMentalEnergy={combat?.mentalEnergy}
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
                <button type="button" className={charStyles.rollButton} onClick={e => {
                    // setRolling(true)
                    // setRollingText('CONTRA-ATAQUE')
                    // setRollConfigs({
                    //     faces: 20,
                    //     times: 1,
                    //     bonus: Math.floor(Number(charState.attributes.strengh) / 2) + (!!charState.specialitys.strengh.fight && 5),
                    //     advantage: true,
                    // })
                }}>CONTRA-ATAQUE</button>
                <button type="button" className={charStyles.rollButton} onClick={e => {
                    // setRolling(true)
                    // setRollingText('SOCO')
                    // setRollConfigs({
                    //     faces: charState.basic?.fightStyle==='fighter'?6:4,
                    //     times: 1,
                    //     bonus: Math.floor(
                    //         Number(charState.attributes.strengh) / (charState.basic?.fightStyle==='figher'?1:2)
                    //     )
                    // })
                }}>SOCO</button>
            </div>
        </div>
        <div className={charStyles.levelArea}>
            <h2>Level</h2>
            {level.actualLevel && <Level {...level} />}
        </div>
        <div className={charStyles.dicesArea}>
            <h2>Dados</h2>
            <Image src={RpgDices} alt="imagens dos dados" useMap='#rpg-dices' />
            <map name="rpg-dices">
                <area alt="1d100" title="1d100" href="#dices-area" coords="42,44,25" shape="circle"/>
                <area alt="1d10" title="1d10" href="#dices-area" coords="101,43,24" shape="circle"/>
                <area alt="1d12" title="1d12" href="#dices-area" coords="160,41,29" shape="circle"/>
                <area alt="1d20" title="1d20" href="#dices-area" coords="228,39,24" shape="circle"/>
                <area alt="1d4" title="1d4" href="#dices-area" coords="65,104,24" shape="circle"/>
                <area alt="1d6" title="1d6" href="#dices-area" coords="143,106,23" shape="circle"/>
                <area alt="1d8" title="1d8" href="#dices-area" coords="212,106,21" shape="circle"/>
            </map>
        </div>
    </CharContainer>
}

export default Character;