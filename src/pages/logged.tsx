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
        Router.push('/playing')
    }

    return <MainContainer>
        <ul className={styles.profilesList}>
            {Children.toArray(charList?.map((id: string) => <CharacterProfile id={id} onClick={handleProfileClick}/>))}
            <AiOutlineUserAdd onClick={() => Router.push('/register-character')} className={styles.addIcon} />
        </ul>
    </MainContainer>
}

export default Logged;