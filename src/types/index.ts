
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
    img: string,
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
export const CharacterDefaultValues = {
    img: "",
    basic: {
        name: "",
        age: "",
        race: "",
        fightStyle: "",
        occupation: "",
    },
    attributes: {
        strengh: 0,
        dexterity: 0,
        constituition: 0,
        education: 0,
        mentality: 0,
        social: 0,
    },
    specialitys: {
        strengh: {
            athletics: false,
            jump: false,
            fight: false,
            climb: false
        },
        dexterity: {
            acrobacy: false,
            stealth: false,
            aim: false,
            dodge: false,
            reflex: false,
        },
        constituition: {
            force: false,
            imunity: false,
            painResistence: false
        },
        education: {
            history: false,
            geography: false,
            math: false,
            investigation: false,
            forensic: false,
            tecnology: false,
            sociology: false,
            art: false,
            physics: false,
            chemistry: false,
            foreignLanguage: false,
            programming: false,
            policy: false,
            religion: false,
            mechanic: false,
            biology: false,
            medicine: false,
        },
        mentality: {
            perception: false,
            insight: false,
            mindResistence: false
        },
        social: {
            intimidation: false,
            cheating: false,
            acting: false,
            charm: false,
            sexy: false,
            persuasion: false,
        }
    },
    combat: {
        life: 0,
        actualLife: 0,
        mentalEnergy: 0,
        actualMentalEnergy: 0,
        movement: 0,
        da: 0,
    },
    abilitys: {
        race: [],
        fightStyle: [],
    },
    level: {
        actualLevel: 0,
        maxXP: 0,
        actualXP: 0
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
        img: string,
        basic: {
            name: String,
            standType: String,
            weakPoint: String,
            img: string,
        },
        attributes?: StandAttributes,
        abilitys?: {
            firstMain?: StandAbility,
            secondMain?: StandAbility,
            passive?: StandAbility
        },
        acts?: {
            act1: {
                img: string,
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act2: {
                img: string,
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act3: {
                img: string,
                attributes: StandAttributes,
                ability: StandAbility,
            },
            act4: {
                img: string,
                attributes: StandAttributes,
                ability: StandAbility,
            }
        }
    },
    substand?: {
        img: string,
        basic: {
            name: string,
            standType: string,
            weakPoint: string,
            img: string,
        },
        attributes?: StandAttributes,
        abilitys: StandAbility,
    }
}


export interface RollConfigsProps {
    faces: number,
    times: number,
    bonus?: number,
    advantage?: boolean,
    disadvantage?: boolean
}
