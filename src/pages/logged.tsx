import { useEffect, useState, Children } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import Router from 'next/router'

import styles from '@/sass/Logged.module.scss'

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"
import CharacterProfile from '@/components/CharacterProfile'

/* API */
import { getCharacter } from '@/api/character'

const Logged = () => {
    const [ charList, setCharList ] = useState<string[]>()
    useEffect(() => {
        async function getData() {
            const response = await getCharacter()
            setCharList(response)
        }
        getData()
    }, [])

    const handleProfileClick = () => {
        
    }

    return <MainContainer>
        <ul className={styles.profilesList}>
            {Children.toArray(charList?.map((id: string) => <CharacterProfile id={id} onClick={handleProfileClick}/>))}
        </ul>
        <AiOutlineUserAdd onClick={() => Router.push('/register-character')} className={styles.addIcon} />
    </MainContainer>;
}

export default Logged;