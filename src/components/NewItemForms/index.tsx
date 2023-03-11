import { Dispatch, SetStateAction, useState, useEffect, useRef, ChangeEvent } from 'react'
import { getCookie } from 'cookies-next'
import { useForm, SubmitHandler } from "react-hook-form"
import styled from "styled-components"
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { AiFillCloseCircle } from 'react-icons/ai'
import InputMask from 'react-input-mask-next'

import styles from './style.module.scss'

import { handleDice } from '@/func/*'

/* API */
import { putItem } from '@/api/inventory'

/* TYPES */
import { InventoryType, Item } from "@/types/*"
interface NewItemFormsProps {
    setShowNewItem: Dispatch<SetStateAction<boolean>>,
    updateInventory: Dispatch<SetStateAction<InventoryType>>
}

/* COMPONENTS */
const Buttons = styled.button`
    background: #00000000;
    border: none;
    font-size: 2vw !important;

    &:hover {
        cursor: pointer;
        transform: none;
        background: #00000000;
    }
`
export function NewItemForm({ setShowNewItem, updateInventory }: NewItemFormsProps) {
    const charId = getCookie("charId")

    const { register, handleSubmit } = useForm<Item>({
        defaultValues: {
            name: '',
            quantity: 0,
            weapon: false,
            weight: 0,
            details: '',
            damage: '',
            critic: '',
            tipo: '',
            range: '',
            effects: {
                burning: false,
                bullet: false,
                slashing: false,
                explosion: false,
                concussion: false,
                heal: false,
            }
        }
    });

    const onSubmit: SubmitHandler<Item> = async (data) => {
        const response = await putItem(charId, data)
        updateInventory(response)
        setShowNewItem(false)
    }

    return <form className={styles.newItemForm} onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder='Nome' {...register('name', {
            required: true
        })} />
        <textarea placeholder='Descrição' {...register('details', {
            required: true
        })}></textarea>
        <div>
            <label htmlFor="quantity">Quantidade: </label><input
                id='quantity'
                type="number"
                min={0}
                {...register('quantity', {
                    required: true,
                    valueAsNumber: true,
                    min: 0
                })}
            />
        </div>
        <div>
            <label htmlFor="weight">Peso: </label><input
                id='weight'
                type="number"
                min={0}
                step=".01"
                {...register('weight', {
                    required: true,
                    valueAsNumber: true,
                    min: 0
                })}
            />
        </div>
        <div className={styles.buttonsContainer}>
            <Buttons type='submit'><BsFillCheckCircleFill/></Buttons>
            <Buttons type='button' onClick={() => setShowNewItem(false)}><AiFillCloseCircle /></Buttons>
        </div>
    </form>
}

export function NewWeaponForm({ setShowNewItem, updateInventory }: NewItemFormsProps) {
    const charId = getCookie("charId")
    const { register, handleSubmit } = useForm<Item>({ defaultValues: {
        weapon: true
    } });

    const [ diceValue, setDiceValue ] = useState<string>("false")
    const [ diceNotReadable, setDiceNotReadable ] = useState<boolean>(false)
    const dicesTypes = {
        machineGun: '2D10',
        pistol: '1D8',
        shotgun: '4D8',
        rifle: '2D12',
        sniper: '2D20',
        grenade: '4D6',
        body: '1D6',
    }

    const onSubmit: SubmitHandler<Item> = async (data) => {
        const newData: Item = {
            ...data,
            damage: handleDice(data.damage)
        }
        const response = await putItem(charId, newData)
        updateInventory(response)
        setShowNewItem(false)
    }

    useEffect(() => {
        const diceInput = document.getElementById('weapon-damage')
        if (diceInput) diceInput.value = diceValue ?? '';
    }, [diceValue])

    // Função pra mudar o dado quando mudar o tipo de arma
    const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value === 'custom') {
            setDiceValue("")
            setDiceNotReadable(false)
            return
        }
        setDiceValue(dicesTypes[value])
        setDiceNotReadable(true)
    }

    return <form className={styles.newItemForm} onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder='Nome' {...register('name', {
            required: true
        })} />
        <div>
            <label htmlFor="weaponType">Tipo: </label>
            <select {...register('tipo', {
                required: true,
                onChange: handleTypeChange
            })}>
                <option value="custom" defaultChecked>Personalizado</option>
                <option value="machineGun">Metralhadora</option>
                <option value="pistol">Pistolas</option>
                <option value="shotgun">Shotguns</option>
                <option value="rifle">Rifles</option>
                <option value="sniper">Snipers</option>
                <option value="grenade">Granada</option>
                <option value="body">Arma Branca</option>
            </select>
        </div>
        <div>
            <label htmlFor="weapon-damage">Dado: </label>
            <InputMask mask="9D99" type="text" readOnly={diceNotReadable} placeholder="xDxx" id='weapon-damage' {...register('damage', {
                required: true
            })} />
        </div>
        <div>
            <label htmlFor="weapon-range">Alcance: </label>
            <input type="number" min={0} id='weapon-range' {...register('range', {
                required: true,
                valueAsNumber: true,
                min: 0,
            })} />
        </div>
        <textarea placeholder='Descrição' {...register('details', {
            required: true
        })}></textarea>
        <div>
            <label htmlFor="weapon-quantity">Quantidade: </label><input
                id='weapon-quantity'
                type="number"
                min={0}
                {...register('quantity', {
                    required: true,
                    valueAsNumber: true,
                    min: 0
                })}
            />
        </div>
        <div>
            <label htmlFor="weapon-weight">Peso: </label><input
                id='weapon-weight'
                type="number"
                min={0}
                step=".01"
                {...register('weight', {
                    required: true,
                    valueAsNumber: true,
                    min: 0
                })}
            />
        </div>
        <div className={styles.buttonsContainer}>
            <Buttons type='submit'><BsFillCheckCircleFill/></Buttons>
            <Buttons type='button' onClick={() => setShowNewItem(false)}><AiFillCloseCircle /></Buttons>
        </div>
    </form>
}
