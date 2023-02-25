import { HTMLAttributes } from "react";
import Image from "next/image";

import Logo from '@/images/logo-tarefa.png'

import styles from './style.module.scss'

const MainContainer = ({ children, ...rest }: HTMLAttributes<HTMLElement>) => {
    return <main {...rest} className={styles.homeContainer}>
        <Image src={Logo} alt="Logo da FENS" className={styles.logo} />
        {children}
    </main>;
}

export default MainContainer;