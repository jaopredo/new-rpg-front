import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { BsFillPersonFill } from 'react-icons/bs'

import styles from './style.module.scss'

/* API */
import { getCharacter } from '@/api/character'

/* TYPES */
import { CharacterFormValues } from '@/types/*'
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

    return <div onClick={onClick} className={styles.profileContainer}>
        <div className={styles.imgContainer}>
            { charInfos?.img && <Image width={100} height={100} src={"https://static.wikia.nocookie.net/batman/images/4/43/JGordon.png/revision/latest?cb=20150504184255&path-prefix=pt-br"} alt="Foto do personagem" /> }
            { !charInfos?.img && <BsFillPersonFill/> }
        </div>
        <h2>{charInfos?.basic?.name}</h2>
    </div>
}

export default CharacterProfile;