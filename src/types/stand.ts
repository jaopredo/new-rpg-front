export type StandTypes = "short-range" |"long-range" |"automatic" |"independent" |"colony" |"act" |"object" |"union" |"ability" |"sharing"
export interface StandInputInfoProps {
    id: "strengh" | "speed" | "durability" | "range" | "precision" | "development",
    label: string
}

export type StandAttributesKeys = "strengh" | "speed" | "durability" | "precision" | "range" | "development"

export type StandAttackEffects = "none" | "burning" | "bullet" | "slashing" | "explosion" | "concussion" | "heal" | "freezing"


export interface StandAttributes {
    strengh: number,
    speed: number,
    durability: number,
    precision: number,
    range: number,
    development: number
}
export interface StandAbility {
    name: string,
    effect: StandAttackEffects,
    dice: string,
    description: string,
}
export interface StandCombat {
    damage: number,
    shield: number,
    bonus: number
}
export interface StandMove {
    range: string,
    apr: number,
    movement: string,
    standJump: string
}

export type StandType = {
    basic: {
        name: string,
        standType: StandTypes,
        weakPoint: string,
        img?: string,
    },
    attributes?: StandAttributes,
    abilitys?: {
        firstMain: StandAbility,
        secondMain: StandAbility,
        passive: StandAbility
    },
    acts?: {
        act1: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
            combat: StandCombat,
            move: StandMove
        },
        act2: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
            combat: StandCombat,
            move: StandMove
        },
        act3: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
            combat: StandCombat,
            move: StandMove
        },
        act4: {
            img?: string,
            attributes: StandAttributes,
            ability: StandAbility,
            combat: StandCombat,
            move: StandMove
        }
    },
    combat: StandCombat,
    move: StandMove
}
export interface SubstandType extends Omit<StandType, "abilitys" | "acts"> {
    ability: StandAbility
}

export type StandFormValues = {
    stand: Omit<StandType, "combat" | "move">,
    substand?: SubstandType
}

// Input Types
export interface StandAttributeInput extends Omit<HTMLInputElement, "value"> {
    id: StandAttributesKeys,
    value: number
}
