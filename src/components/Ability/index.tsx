import React from 'react';

import styles from './style.module.scss'

interface AbilityProps {
    title: string,
    register: Function,
    abName: string
}

const Ability = ({ title, register, abName }: AbilityProps) => {
    return <div className={styles.ability}>
        <h4>{title}</h4>
        <input {...register(`${abName}.name`, { required: true })}/>
        <div className={styles.wrapper}>
            <label htmlFor="effect">EFEITO</label>
            <select id='effect' {...register(`${abName}.effect`, { required: true })}>
                <option value="none" defaultChecked>Nenhum</option>
                <option value="burning">Queimar</option>
                <option value="bullet">Projétil</option>
                <option value="slashing">Cortar</option>
                <option value="explosion">Explosivo</option>
                <option value="concussion">Pancada</option>
                <option value="heal">Curar</option>
                <option value="freezing">Congelar</option>
            </select>
        </div>
        <div className={styles.wrapper}>
            <label htmlFor="dice">DADO</label>
            <input type="text" maxLength={5} {...register(`${abName}.dice`, {
                required: true,
            })}/>
        </div>
        <textarea id="description" {...register(`${abName}.description`, { required: true })}></textarea>
    </div>
}

export default Ability