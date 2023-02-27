
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

export type StandAttributes = {
    strengh: number,
    speed: number,
    durability: number,
    precision: number,
    range: number,
    development: number
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
export type StandFormValues = {
    basic: {
        name: String,
        standType: String,
        weakPoint: String,
        img: String,
    },
    attributes: {
        strengh: number,
        speed: number,
        durability: number,
        precision: number,
        range: number,
        development: number
    },
    abilitys?: {
        firstMain?: {
            name: String,
            effect: String,
            dice: String,
            description: String,
        },
        secondMain?: {
            name: String,
            effect: String,
            dice: String,
            description: String,
        },
        passive?: {
            name: String,
            effect: String,
            dice: String,
            description: String,
        }
    },
    acts?: {
        act1: {
            attributes: {
                strengh: number,
                speed: number,
                durability: number,
                precision: number,
                range: number,
            },
            ability: {
                name: string,
                effect: string,
                dice: string,
                description: string,
            },
        },
        act2: {
            attributes: {
                strengh: number,
                speed: number,
                durability: number,
                precision: number,
                range: number,
            },
            ability: {
                name: String,
                effect: String,
                dice: String,
                description: String,
            },
        },
        act3: {
            attributes: {
                strengh: number,
                speed: number,
                durability: number,
                precision: number,
                range: number,
            },
            ability: {
                name: String,
                effect: String,
                dice: String,
                description: String,
            },
        },
        act4: {
            attributes: {
                strengh: number,
                speed: number,
                durability: number,
                precision: number,
                range: number,
            },
            ability: {
                name: String,
                effect: String,
                dice: String,
                description: String,
            },
        }
    }
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

export interface StandInputInfoProps {
    id: "strengh" | "speed" | "durability" | "range" | "precision" | "development",
    label: string
}
