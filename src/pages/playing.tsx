import { useState, useRef, useEffect } from 'react'
import { getCookie } from 'cookies-next'

import styles from "@/sass/Sheet.module.scss"
import playStyles from '@/sass/Playing.module.scss'

/* COMPONENTS */
import MainContainer from '@/components/MainContainer'

/* API */
import { getCharacter } from '@/api/character'
import { getStand } from '@/api/stand'

/* TYPES */
import { CharacterFormValues, CharacterDefaultValues, RollConfigsProps } from '../types'

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
    // const [ standInfos, setStandInfos ] = useState()

    useEffect(() => {
        async function getData() {
            setCharInfos(await getCharacter(charId))
            // setStandInfos(await getStand(charId))
        }
        getData()
    }, [])

    return <MainContainer>
        <menu className={playStyles.chooseMenu}>
            <li onClick={() => setShowing("char")}>PERSONAGEM</li>
            <li onClick={() => setShowing("stand")}>STAND</li>
            <li onClick={() => setShowing("inventory")}>INVENTÁRIO</li>
        </menu>
        {showing == "char" && <Character roll={roll} {...charInfos} />}
        {showing == "stand" && <Stand />}
        {showing == "inventory" && <Inventory/>}
        {rollState.rolling && <DiceRoll rollConfigs={rollState.rollConfigs} closeRollScreen={closeRollScreen}/>}
    </MainContainer>
}

export default Playing