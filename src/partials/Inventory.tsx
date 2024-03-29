import { useState, useEffect, useRef, Children, Dispatch, SetStateAction } from 'react'
import { getCookie } from 'cookies-next'
import styled from 'styled-components'
import { VscDiffAdded } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'

import inventoryStyles from './Inventory.module.scss'
import sheetStyles from '@/sass/Sheet.module.scss'

/* FUNCTRIONS */
import { returnRollConfigsByString } from '../func'

/* API */
import { deleteItem } from '@/api/inventory'

/* COMPONENTS */
import { InventoryContainer } from '@/components/Containers'
import { NewItemForm, NewWeaponForm } from '@/components/NewItemForms'

/* TYPES */
import { InventoryType } from '@/types/inventory'
import { RollConfigsProps } from '@/types/index'

interface InventoryProps extends InventoryType {
    charName: string,
    updateInventory: Dispatch<SetStateAction<InventoryType>>,
    roll: (rollConfigs: RollConfigsProps) => void
}

const BagsList = styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 10px;
    font-size: 1.3em;
`

const Inventory = ({ items, charName, updateInventory, roll }: InventoryProps) => {
    const charId = getCookie('charId') as string

    const [ showNewItem, setShowNewItem ] = useState<boolean>(false)
    const [ showNewWeapon, setShowNewWeapon ] = useState<boolean>(false)

    const [ totalSpaces, setTotalSpaces ] = useState<number>(3)
    const [ usedSpaces, setUsedSpaces ] = useState<number>(0)

    useEffect(() => {
        let counter = 0
        items?.forEach(item => {
            counter += item.weight * item.quantity
        })
        setUsedSpaces(counter)
    }, [ items ])

    const usedSpacesRef = useRef<HTMLInputElement>(null)

    function changeWeightStyle() {
        if (usedSpaces > totalSpaces) {
            if (usedSpacesRef.current) usedSpacesRef.current.style.color = '#d64040'
        } else {
            if(usedSpacesRef.current) usedSpacesRef.current.style.color = 'white'
        }
    }

    useEffect(() => {
        changeWeightStyle()
    }, [ usedSpaces, totalSpaces ])

    const handleDeleteItem = async (itemId: string) => {
        const response = await deleteItem(itemId, charId)
        if (!response.error) updateInventory(response)
    }

    const bags = {
        'nothing': 1,
        'bolso': 3,
        'porchet': 10,
        'mid-backpack': 15,
        'big-backpack': 18,
        'suitcase': 20,
    }
    const bagTranslate = {
        'nothing': 'Nada',
        'bolso': 'Bolso',
        'porchet': 'Porchet',
        'mid-backpack': 'Mochila Média',
        'big-backpack': 'Mochila Grande',
        'suitcase': 'Mala'
    }
    const weaponTypes = {
        custom: 'Personalizado',
        machineGun: 'Metralhadora',
        pistol: 'Pistolas',
        shotgun: 'Shotguns',
        rifle: 'Rifles',
        sniper: 'Snipers',
        grenade: 'Granada',
        body: 'Arma Branca',
    }

    return <InventoryContainer>
        <div className={sheetStyles.basicArea}>
            <h1 className={sheetStyles.name}>{charName}</h1>
            <BagsList>
                {Children.toArray((Object.keys(bags) as Array<keyof typeof bags>).map(bag => <li>
                    <input onChange={() => setTotalSpaces(bags[bag])} type="radio" name="bag-spaces" id={bag[0]} />
                    <label htmlFor={bag[0]}>{bagTranslate[bag]}</label>
                </li>))}
            </BagsList>
        </div>
        <div className={inventoryStyles.itemsArea}>
            <h2>Itens <div className={inventoryStyles.spaces}><span className={inventoryStyles.usedSpaces}>{usedSpaces.toFixed(1)}</span>/{totalSpaces}</div></h2>
            <table className={inventoryStyles.itemsTable}>
                <thead>
                    <tr><th>Nome</th><th>Detalhe</th><th>Quantidade</th><th>Peso</th><th>Deletar</th></tr>
                </thead>
                <tbody>
                    {Children.toArray(items?.map(
                        item => <tr>
                            <td>{item.name}</td>
                            <td>{item.details}</td>
                            <td>{item.quantity}</td>
                            <td>{item.weight}</td>
                            <td className={inventoryStyles.delContainer}><BsFillTrashFill onClick={() => handleDeleteItem(item._id)} /></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><VscDiffAdded className={inventoryStyles.addItem} onClick={() => setShowNewItem(true)}/></td>
                    </tr>
                </tfoot>
            </table>
            { showNewItem && <NewItemForm updateInventory={updateInventory} setShowNewItem={setShowNewItem} /> }
        </div>
        <div className={inventoryStyles.weaponsArea}>
            <h2>Armas</h2>
            <table className={inventoryStyles.itemsTable}>
                <thead>
                    <tr>
                        <th>ARMA</th>
                        <th>TIPO</th>
                        <th>DANO</th>
                        <th>CRÍTICO</th>
                        <th>ALCANCE</th>
                        <th>PESO</th>
                        <th>QUANTIDADE</th>
                    </tr>
                </thead>
                <tbody>
                    {Children.toArray(items?.map(
                        item => item.weapon && <tr>
                            <td>{item.name}</td>
                            <td>{weaponTypes[item.tipo]}</td>
                            <td onClick={() => roll({
                                ...returnRollConfigsByString(item.damage),
                                action: "damage"
                            })} className={inventoryStyles.damageWeapon}>{item.damage}</td>
                            <td onClick={() => {
                                const configs = {
                                    ...returnRollConfigsByString(item.damage),
                                }
                                roll({
                                    ...configs,
                                    times: configs.times + 1,
                                    action: "damage"
                                })
                            }} className={inventoryStyles.damageWeapon}>{item.damage}+1</td>
                            <td>{item.range}</td>
                            <td>{item.weight}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr><td><VscDiffAdded className={inventoryStyles.addItem} onClick={() => setShowNewWeapon(true)}/></td></tr>
                </tfoot>
            </table>
            { showNewWeapon && <NewWeaponForm
                updateInventory={updateInventory}
                setShowNewItem={setShowNewWeapon}
            /> }
        </div>
    </InventoryContainer>
}

export default Inventory