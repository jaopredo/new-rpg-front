// export type CharSpecsKeys = {
//     area: "strengh" | "dexterity" | "constituition" | "mentality" | "education" | "social",
//     id: "athletics"|"jump"|"fight"|"climb"|"acrobacy"|"stealth"|"aim"|"dodge"|"reflex"|
//     "force"|"imunity"|"painResistence"|"history"|"geography"|"math"|"investigation"|"forensic"|
//     "tecnology"|"sociology"|"art"|"physics"|"chemistry"|"foreignLanguage"|"programming"|"policy"|
//     "religion"|"mechanic"|"biology"|"medicine"|"perception"|"insight"|"mindResistence"|
//     "intimidation"|"cheating"|"acting"|"charm"|"sexy"|"persuasion",
//     label: string
// }



export interface StandInputInfoProps {
    id: "strengh" | "speed" | "durability" | "range" | "precision" | "development",
    label: string
}

export interface StandAttributes {
    strengh: number,
    speed: number,
    durability: number,
    precision: number,
    range: number,
    development?: number
}

export interface StandAbility {
    name: String,
    effect: String,
    dice: String,
    description: String,
}

export type StandType = {
    img?: string,
    basic: {
        name: String,
        standType: String,
        weakPoint: String,
    },
    attributes?: StandAttributes,
    abilitys?: {
        firstMain?: StandAbility,
        secondMain?: StandAbility,
        passive?: StandAbility
    },
    combat: {
        damage: number,
        shield: number,
        bonus: number
    },
    move: {
        range: String,
        apr: number,
        movement: String,
        standJump: String
    },
    acts?: {
        act1: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
        },
        act2: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
        },
        act3: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
        },
        act4: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
        }
    }
}
export type SubstandType = {
    img: string,
    basic: {
        name: string,
        standType: string,
        weakPoint: string,
        img: string,
    },
    attributes?: StandAttributes,
    ability: StandAbility,
    combat: {
        damage: number,
        shield: number,
        bonus: number
    },
    move: {
        range: string,
        apr: number,
        movement: string,
        standJump: string
    }
}

export type StandFormValues = {
    stand: StandType,
    substand?: SubstandType
}

export interface RollConfigsProps {
    faces: number,
    times: number,
    bonus?: number,
    advantage?: boolean,
    disadvantage?: boolean,
    action: "roll" | "damage" | "barragem"
}


export type Item = {
    _id: string,
    name: string,
    quantity: number,
    weight: number,
    weapon: boolean,
    details: string,
    damage: string,
    tipo: string,
    range: string
}

export interface InventoryType {
    items: Item[]
}
