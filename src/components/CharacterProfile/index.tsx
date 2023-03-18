import { MouseEventHandler, useEffect, useState } from 'react'
import { setCookie } from 'cookies-next'
import Image from 'next/image'
import { BsFillPersonFill, BsFillTrashFill } from 'react-icons/bs'
import Router from 'next/router'

import styles from './style.module.scss'

/* API */
import { getCharacter, deleteCharacter } from '@/api/character'

/* TYPES */
import { CharacterFormValues } from '@/types/character'
interface CharProfileProps {
    id: string,
    onClick: MouseEventHandler
}

const CharacterProfile = ({ id, onClick }: CharProfileProps) => {
    const [ charInfos, setCharInfos ] = useState<CharacterFormValues>()

    useEffect(() => {
        async function getData() {
            setCharInfos(await getCharacter(id))
        }
        getData()
    }, [])

    return <div className={styles.profileContainer}>
        <div className={styles.imgContainer}>
            <BsFillTrashFill className={styles.trashIcon} onClick={() => {
                deleteCharacter(id)
                Router.reload()
            }}/>
            { charInfos?.img && <Image width={100} height={100} src={charInfos?.img} alt="" /> }
            { !charInfos?.img && <BsFillPersonFill/> }
        </div>
        <div onClick={(e) => {
            setCookie("charId", id)
            onClick(e)
        }}>
            <h3>{charInfos?.basic?.name}</h3>
        </div>
    </div>
}

export default CharacterProfile;