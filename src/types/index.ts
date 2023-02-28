
export type PlayerFormValues = {
    email: String,
    password: String,
    confPassw: String
}


export type CharacterAttributes = {
    strengh: number,
    dexterity: number,
    constituition: number,
    education: number,
    mentality: number,
    social: number,
}
export type CharacterSpecialitys = {
    strengh: {
        athletics: boolean,
        jump: boolean,
        fight: boolean,
        climb: boolean
    },
    dexterity: {
        acrobacy: boolean,
        stealth: boolean,
        aim: boolean,
        dodge: boolean,
        reflex: boolean,
    },
    constituition: {
        force: boolean,
        imunity: boolean,
        painResistence: boolean
    },
    education: {
        history: boolean,
        geography: boolean,
        math: boolean,
        investigation: boolean,
        forensic: boolean,
        tecnology: boolean,
        sociology: boolean,
        art: boolean,
        physics: boolean,
        chemistry: boolean,
        foreignLanguage: boolean,
        programming: boolean,
        policy: boolean,
        religion: boolean,
        mechanic: boolean,
        biology: boolean,
        medicine: boolean,
    },
    mentality: {
        perception: boolean,
        insight: boolean,
        mindResistence: boolean
    },
    social: {
        intimidation: boolean,
        cheating: boolean,
        acting: boolean,
        charm: boolean,
        sexy: boolean,
        persuasion: boolean,
    },
}

export type CharacterFormValues = {
    basic: {
        name: string,
        age: string,
        race: string,
        fightStyle: string,
        occupation: string,
    },
    attributes: CharacterAttributes,
    specialitys: CharacterSpecialitys,
    combat: {
        life: number,
        actualLife: number,
        mentalEnergy: number,
        actualMentalEnergy: number,
        movement: number,
        da: number,
    },
    abilitys: {
        race: Object[],
        fightStyle: Object[],
    },
    level: {
        actualLevel: number,
        maxXP: number,
        actualXP: number
    },
}

export type CharSpecsKeys = {
    area: any,
    id: any,
    label: any
}
export interface CharacterInputInfoProps {
    id: "strengh" | "dexterity" | "constituition" | "mentality" | "education" | "social",
    label: string
}
export interface CharacterInputSpecProps {
    strengh: CharSpecsKeys[],
    dexterity: CharSpecsKeys[],
    constituition: CharSpecsKeys[],
    education: CharSpecsKeys[],
    mentality: CharSpecsKeys[],
    social: CharSpecsKeys[],
}


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

export type StandFormValues = {
    stand: {
        basic: {
            name: String,
            standType: String,
            weakPoint: String,
            img: String,
        },
        attributes?: StandAttributes,
        abilitys?: {
            firstMain?: StandAbility,
            secondMain?: StandAbility,
            passive?: StandAbility
        },
        acts?: {
            act1: {
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act2: {
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act3: {
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act4: {
                attributes: StandAttributes,
                ability: StandAbility,
            }
        }
    },
    substand?: {
            basic: {
            name: String,
            standType: String,
            weakPoint: String,
            img: String,
        },
        attributes?: StandAttributes,
        abilitys: StandAbility,
    }
}