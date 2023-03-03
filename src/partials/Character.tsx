import { Children, useRef, useEffect, ChangeEvent } from 'react'
import { GoVerified } from 'react-icons/go'

import charStyles from './Character.module.scss'
import sheetStyles from '@/sass/Sheet.module.scss'

/* API */
import { getCharSpecialitys } from '@/api/config'

/* COMPONENTS */
import { CharContainer } from '@/components/Containers'
import Life from '@/components/Life'

/* TYPES */
import { CharacterFormValues } from '@/types/';

const Character = ({ basic, attributes, specialitys, combat }: CharacterFormValues) => {
    const specInfos = useRef()

    useEffect(() => {
        async function getData() {
            specInfos.current = await getCharSpecialitys()
        }
        getData()
    }, [])

    return <CharContainer>
        <div className={sheetStyles.basicArea}>
            <h1>{basic?.name}</h1>
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
            <Life
                actualLife={combat.actualLife}
                maxLife={combat.life}
            />
            {/* <div id="mental-energy">
                <h3>ENERGIA MENTAL</h3>
                <div className='health-container'>
                    <MaxXp/>
                    <ActualMentalEnergyContainer id='actual-mental-energy'/>
                    <p>
                        <input
                            type="text"
                            defaultValue={actualMentalEnergy}
                            onKeyUp={e => handleHealthKeyDown(e, 'mental-energy')}
                            ref={mentalEnergyInputRef}
                            onBlur={e => e.target.value = actualMentalEnergy}
                            maxLength={3}
                        /> / {charState.combat?.mentalEnergy}
                    </p>
                    <ul className='generic-list mental-buttons'>
                        <li><button className='roll-button' onClick={() =>
                            setActualMentalEnergy(actualMentalEnergy - (standResistence + 1))
                        }>STAND</button></li>
                        <li><button className='roll-button' onClick={() =>
                            setActualMentalEnergy(actualMentalEnergy - 20)
                        }>PRINCIPAL</button></li>
                        <li><button className='roll-button' onClick={() => 
                            setActualMentalEnergy(actualMentalEnergy - 15)
                        }>SECUNDÁRIA</button></li>
                        { subStandResistence && <li><button className='roll-button' onClick={() =>
                            setActualMentalEnergy(actualMentalEnergy - (subStandResistence + 1))
                        }>SUB-STAND</button></li> }
                        <li><button className='roll-button' onClick={() =>
                            setActualMentalEnergy(charState.combat?.mentalEnergy)
                        }>REGENERAR</button></li>
                    </ul>
                </div>
            </div>*/}
        </div>
    </CharContainer>
}

export default Character;