import { useEffect, useState, Children } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import Router from 'next/router'

import styles from '@/sass/Logged.module.scss'

/* COMPONENTS */
import MainContainer from "@/components/MainContainer"

/* API */
import { getCharacter } from '@/api/character'

const Logged: React.FC = () => {
    const [ charList, setCharList ] = useState<String[]>()
    useEffect(() => {
        async function getData() {
            const response = await getCharacter()
            setCharList(response)
        }
        getData()
    }, [])

    return <MainContainer>
        <AiOutlineUserAdd onClick={() => Router.push('/register-character')} className={styles.addIcon} />
    </MainContainer>;
}

export default Logged;