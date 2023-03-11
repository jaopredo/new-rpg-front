import { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { ImExit } from 'react-icons/im'
import Router from 'next/router'

import playStyles from '@/sass/Playing.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'

/* API */
import { getCharacter } from '@/api/character'
import { getStand, getSubstand } from '@/api/stand'
import { getInventory } from '@/api/inventory'

/* TYPES */
import { CharacterFormValues, CharacterDefaultValues, RollConfigsProps, StandType, SubstandType, InventoryType } from '../types'

/* PARTIALS */
import Character from '@/partials/Character'
import Stand from '@/partials/Stand'
import Inventory from '@/partials/Inventory'

/* COMPONENTS */
import { DiceRoll } from '@/components/Roll'

const Playing = () => {
    const charId = getCookie("charId")

    const [ rollState, setRollState ] = useState<{ rolling: boolean, rollConfigs: RollConfigsProps}>({
        rolling: false,
        rollConfigs: {
            faces: 20,
            times: 1
        }
    })
    function closeRollScreen() {
        setRollState({ ...rollState, rolling: false })
    }
    function roll(configs: RollConfigsProps) {
        setRollState({ rolling: true, rollConfigs: configs })
    }

    const [ showing, setShowing ] = useState<"char" | "stand" | "inventory">("char")

    const [ charInfos, setCharInfos ] = useState<CharacterFormValues>(CharacterDefaultValues)
    const [ standInfos, setStandInfos ] = useState<StandType>()
    const [ substandInfos, setSubstandInfos ] = useState<SubstandType>()
    const [ inventoryInfos, setInventoryInfos ] = useState<InventoryType>({ items: [] })

    useEffect(() => {
        async function getData() {
            setCharInfos(await getCharacter(charId))
            const stand = await getStand(charId)
            setStandInfos(stand)
            setSubstandInfos(await getSubstand(stand?.id))

            setInventoryInfos(await getInventory(charId))
        }
        getData()
    }, [])

    return <MainContainer>
        <menu className={playStyles.chooseMenu}>
            <li onClick={() => setShowing("char")}>PERSONAGEM</li>
            <li onClick={() => setShowing("stand")}>STAND</li>
            <li onClick={() => setShowing("inventory")}>INVENTÁRIO</li>
            <li onClick={() => Router.back()}><ImExit/></li>
        </menu>
        {showing == "char" && <Character roll={roll} {...charInfos} />}
        {showing == "stand" && <Stand roll={roll} stand={standInfos} substand={substandInfos} />}
        {showing == "inventory" && <Inventory charName={charInfos?.basic.name} {...inventoryInfos} updateInventory={setInventoryInfos} />}
        {rollState.rolling && <DiceRoll rollConfigs={rollState.rollConfigs} closeRollScreen={closeRollScreen}/>}
    </MainContainer>
}

export default Playing