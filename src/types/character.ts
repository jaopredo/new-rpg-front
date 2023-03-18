
// Raças do Personagem
export type CharacterRaces = {
    human: string;
    vampire: string;
    rockman: string;
    animal: string;
}
export type CharacterRacesKeys = "human" | "vampire" | "rockman" | "animal"

// Atributos do Personagem
export type CharacterAttributes = {
    strengh: number,
    dexterity: number,
    constituition: number,
    education: number,
    mentality: number,
    social: number,
}

// Especialidades do Personagem
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

export type CharSpecsValues = "athletics"|"jump"|"fight"|"climb"|"acrobacy"|"stealth"|"aim"|"dodge"|"reflex"|
    "force"|"imunity"|"painResistence"|"history"|"geography"|"math"|"investigation"|"forensic"|
    "tecnology"|"sociology"|"art"|"physics"|"chemistry"|"foreignLanguage"|"programming"|"policy"|
    "religion"|"mechanic"|"biology"|"medicine"|"perception"|"insight"|"mindResistence"|
    "intimidation"|"cheating"|"acting"|"charm"|"sexy"|"persuasion"

// Tipos do Formulário
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

// Valores padrões do formulário
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

export type CharFightStyleKeys = "spin" | "shooter" | "fighter" | "fencing" | "hamon" | "none"

// Propriedades dos inputs
export type CharacterAttributesKeys = "strengh" | "dexterity" | "constituition" | "mentality" | "education" | "social"

// Tipos das informações de Especialidades
export type CharSpecsKeys = {
    area: CharacterAttributesKeys,
    id: CharSpecsValues,
    label: string
}

export interface CharacterInputInfoProps {
    id: CharacterAttributesKeys,
    label: string
}

// Tipo das informações das especialidades
export interface CharacterInputSpecProps {
    strengh: CharSpecsKeys[],
    dexterity: CharSpecsKeys[],
    constituition: CharSpecsKeys[],
    education: CharSpecsKeys[],
    mentality: CharSpecsKeys[],
    social: CharSpecsKeys[],
}

// Tipo dos inputs
// Atributos
export interface CharacterAttrInput extends HTMLInputElement {
    id: CharacterAttributesKeys
}
// Raças
export interface CharacterRacesSelect extends HTMLSelectElement {
    value: CharacterRacesKeys
}

export interface CharacterFightStyleSelect extends HTMLSelectElement {
    value: CharFightStyleKeys
}

interface CharStrenghSpec {
    label: "strengh",
    spec: "athletics"|"jump"|"fight"|"climb"
}
interface CharDexteritySpec {
    label: "dexterity",
    spec: "acrobacy"|"stealth"|"aim"|"dodge"|"reflex"
}
interface CharConstituitionSpec {
    label: "constituition",
    spec: "force"|"imunity"|"painResistence"
}
interface CharEducationSpec {
    label: "education",
    spec: "history"|"geography"|"math"|"investigation"|"forensic"|
    "tecnology"|"sociology"|"art"|"physics"|"chemistry"|"foreignLanguage"|"programming"|"policy"|
    "religion"|"mechanic"|"biology"|"medicine"
}
interface CharMentalitySpec {
    label: "mentality",
    spec: "perception"|"insight"|"mindResistence"
}
interface CharSocialSpec {
    label: "social",
    spec: "intimidation"|"cheating"|"acting"|"charm"|"sexy"|"persuasion"
}


export type CharacterFightAdvantage = CharStrenghSpec | CharDexteritySpec | CharConstituitionSpec |CharEducationSpec | CharMentalitySpec | CharSocialSpec

export type CharFightAdvantagesTypes = {
    hamon: CharacterFightAdvantage[],
    spin: CharacterFightAdvantage[],
    shooter: CharacterFightAdvantage[],
    fencing: CharacterFightAdvantage[],
    fighter: CharacterFightAdvantage[],
    none: CharacterFightAdvantage[],
}