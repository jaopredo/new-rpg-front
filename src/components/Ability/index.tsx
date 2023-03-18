import { StandAbility, StandAttackEffects } from '@/types/stand'
import { MouseEventHandler } from 'react'
import InputMask from 'react-input-mask-next'

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
            {/* <input type="text" maxLength={5} {...register(`${abName}.dice`, {
                required: true,
            })}/> */}
            <InputMask mask="9D99" {...register(`${abName}.dice`)} />
        </div>
        <textarea id="description" {...register(`${abName}.description`, { required: true })}></textarea>
    </div>
}


interface DoneAbilityProps {
    title: string,
    infos: StandAbility,
    rollDice: MouseEventHandler<HTMLInputElement>
}

export function DoneHab({ title, infos, rollDice }: DoneAbilityProps) {
    const handleEffect = (effect: StandAttackEffects) => {
        const effects = {
            none: 'Nenhum',
            burning: 'Queimar',
            bullet: 'Projétil',
            slashing: 'Cortar',
            explosion: 'Explosivo',
            concussion: 'Pancada',
            heal: 'Curar',
            freezing: 'Congelar',
        }

        return effects[effect];
    }

    return <div className={styles.doneAbility}>
        <h4>{title}</h4>
        <h5>{infos?.name}</h5>
        <div className={styles.doneInfosContainer}>
            <div className={styles.wrapper}>
                <p>EFEITO</p>
                <span className={styles.habInfo}>{ handleEffect(infos?.effect) }</span>
            </div>
            <div className={styles.wrapper}>
                <p>DADO</p>
                <input
                    className={styles.habInfo}
                    defaultValue={infos?.dice}
                    readOnly
                    onClick={rollDice}
                />
            </div>
            <p className={styles.description}>{infos?.description}</p>
        </div>
    </div>
}

export default Ability