import AxiosService from "."

export async function getMaxLevel() {
    const response = await AxiosService.get('/configs/maxLevel')
    return response.data
}

export async function getCharAttributes() {
    const response = await AxiosService.get('/configs/charAttributes')
    return response.data
}

export async function getCharSpecialitys() {
    const response = await AxiosService.get('/configs/charSpecialitys')
    return response.data
}

export async function getStandAttributes() {
    const response = await AxiosService.get('/configs/standAttributes')
    return response.data
}

export async function getStandPDAbilitys() {
    const response = await AxiosService.get('/configs/standPDAbilitys')
    return response.data
}

/* INFORMAÇÕES SECUNDÁRIAS */
export async function getRaceMaxAttrs() {
    const response = await AxiosService.get('/configs/racesMaxAttrs')
    return response.data
}

export async function getRaceAbilitys() {
    const response = await AxiosService.get('/configs/racesAbilitys')
    return response.data
}

export async function getRaceAdvantages() {
    const response = await AxiosService.get('/configs/racesAdvantages')
    return response.data
}

export async function getFightStyleAbilitys() {
    const response = await AxiosService.get('/configs/fightingStyleAbilitys')
    return response.data
}

export async function getFightStyleAdvantages() {
    const response = await AxiosService.get('/configs/fightingStyleAdvantages')
    return response.data
}

export const getLabels = () => ({  // Textos que vão aparecer quando selecionar cada raça
    race: {
        "human": "+1 Social e +1 Educação",
        "vampire": "+1 Força e +1 Constituição",
        "rockman": "+1 Mentalidade +1 Destreza",
        "animal": "+2 Mentalidade +1 Constituição -2 Educação"
    },
    fightStyle: {
        "none": "",
        "hamon": "Vigor e Atletismo",
        "spin": "Mira e Matemática",
        "fencing": "Esquiva e Reflexo",
        "shooter": "Mira e Resistência Psicológica",
        "fighter": "Briga e Resistência à Dor"
    }
})

export const getStandLetters = () => '∅EDCBA';

export const defaultAttrConfigs = () => ({  // Retorna os valores básicos de atributos de stand e personagem
    character: {
        strengh: 1,
        dexterity: 1,
        constituition: 1,
        education: 1,
        mentality: 1,
        social: 1
    },
    stand: {
        strengh: 0,
        speed: 0,
        durability: 0,
        precision: 0,
        range: 0,
        development: 0
    },
    acts: {
        act1: 0,
        act2: 0,
        act3: 0,
        act4: 0
    }
})
