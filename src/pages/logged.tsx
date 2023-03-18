import { useEffect, useState, Children } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import Router from 'next/router'

import styles from '@/sass/Logged.module.scss'

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"
import { LoaderWindowContainer } from '@/components/Containers'
import CharacterProfile from '@/components/CharacterProfile'

/* API */
import { getCharacter } from '@/api/character'
import { getPlayerName } from '@/api/player'

const Logged = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ charList, setCharList ] = useState<string[]>([])
    const [ playerName, setPlayerName ] = useState<string>("")
    useEffect(() => {
        async function getData() {
            const response = await getCharacter()
            setCharList(response)

            setPlayerName(await getPlayerName())
        }
        getData()
    }, [])

    const handleProfileClick = () => {
        setIsLoading(true)
        Router.push('/playing')
    }

    return <MainContainer>
        <h1>{playerName}</h1>
        <ul className={styles.profilesList}>
            {Children.toArray(charList?.map((id: string) => <CharacterProfile id={id} onClick={handleProfileClick}/>))}
            <AiOutlineUserAdd onClick={() => {
                setIsLoading(true)
                Router.push('/register-character')
            }} className={styles.addIcon} />
        </ul>
        { isLoading && <LoaderWindowContainer/> }
    </MainContainer>
}

export default Logged;