import { HTMLAttributes, MouseEventHandler } from "react"
import styled from "styled-components"
import { MdClose } from 'react-icons/md'

import styles from './style.module.scss'

export const CharContainer = styled.div`
    display: grid;
    gap: 10px;
    grid-template-columns: 37.5% 37.5% auto;
    grid-template-rows: 20vh auto auto auto auto;
    grid-template-areas:
        "basic basic status"
        "attrs attrs specs"
        "saude movimento specs"
        "defesa reacoes specs"
        "nivel dados specs";
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    height: 100%;

    h2 {
        background: #2b2b2b;
        color: white;
        text-align: center;
        width: 100%;
        padding: 5px;
    }
`

const standTemplateAreas = `
    "basic basic ."
    "attrs attrs substand"
    "batalha movimento substand"
    "hab hab substand"
    "hab hab substand"
`
const actStandTemplateAreas = `
    "basic basic ."
    "acts acts acts"
    "acts acts acts"
    "acts acts acts"
    "acts acts acts"
`

export const StandContainer = styled.div<{ acts: boolean }>`
    display: grid;
    gap: 10px;
    grid-template-columns: 37.5% 37.5% auto;
    grid-template-rows: 20vh auto auto auto auto;
    grid-template-areas: ${props => props.acts?actStandTemplateAreas:standTemplateAreas};
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    height: 100%;

    input {
        text-align: center;
        transition: background-color 0.5s;
        &:hover {
            background-color: #b4b4b4;
            cursor: pointer;
        }
        &:active {
            background-color: #808080;
        }
    }
    h2 {
        background: #2b2b2b;
        color: white;
        text-align: center;
        width: 100%;
        padding: 5px;
    }
`


const WindowContainerDiv = styled.div`
    background: #636363;
    text-align: center;

    width: 50%;
    min-height: 50%;
    padding: 20px;

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    color: white;
    
    border-radius: 10px;
    box-shadow: 3px 3px 3px #000000;
`

interface WindowContainerProps extends HTMLAttributes<HTMLDivElement> {
    closeWindow: MouseEventHandler
}

export function WindowContainer({ closeWindow, children, ...rest }: WindowContainerProps) {
    return <WindowContainerDiv {...rest}>
        <MdClose className={styles.closeIcon} onClick={closeWindow}/>
        {children}
     </WindowContainerDiv>
}

export const Error = styled.p`
    color: #ff5050;
    font-weight: bold;
`
