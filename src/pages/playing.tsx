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
import { CharacterFormValues, CharacterDefaultValues } from '@/types/character'
import { StandType, SubstandType } from '@/types/stand'
import { InventoryType } from '@/types/inventory'
import { RollConfigsProps } from '@/types/index'

/* PARTIALS */
import Character from '@/partials/Character'
import Stand from '@/partials/Stand'
import Inventory from '@/partials/Inventory'

/* COMPONENTS */
import { DiceRoll, DamageRoll, Barragem } from '@/components/Roll'

const Playing = () => {
    const charId = getCookie("charId") as string

    const [ rollState, setRollState ] = useState<{ rolling: boolean, rollConfigs: RollConfigsProps }>({
        rolling: false,
        rollConfigs: {
            faces: 20,
            times: 1,
            action: "roll"
        }
    })
    const [ rollBarrage, setRollBarrage ] = useState<{ rolling: boolean, rollBarrageConfigs: { strengh: number, speed: number } }>({
        rolling: false,
        rollBarrageConfigs: {
            strengh: 1,
            speed: 1
        }
    })
    function closeRollScreen() {
        setRollState({ ...rollState, rolling: false })
        setRollBarrage({ ...rollBarrage, rolling: false })
    }
    function roll(configs: RollConfigsProps) {
        setRollState({ rolling: true, rollConfigs: configs })
    }
    function barrage(configs: { strengh: number, speed: number }) {
        setRollBarrage({ rolling: true, rollBarrageConfigs: configs })
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
        {(showing == "char" && !!charInfos) && <Character roll={roll} {...charInfos} />}
        {(showing == "stand" && !!standInfos) && <Stand barrage={barrage} roll={roll} stand={standInfos} substand={substandInfos} />}
        {(showing == "inventory" && !!inventoryInfos) && <Inventory roll={roll} charName={charInfos?.basic.name} {...inventoryInfos} updateInventory={setInventoryInfos} />}
        {(rollState.rolling && rollState.rollConfigs.action === "roll") && 
            <DiceRoll rollConfigs={rollState.rollConfigs} closeRollScreen={closeRollScreen}/>}
        {(rollState.rolling && rollState.rollConfigs.action === "damage") &&
            <DamageRoll rollConfigs={rollState.rollConfigs} closeRollScreen={closeRollScreen}/>}
        {(rollBarrage.rolling) &&
            <Barragem barrageConfigs={rollBarrage.rollBarrageConfigs} closeRollScreen={closeRollScreen}/>}
    </MainContainer>
}

export default Playing