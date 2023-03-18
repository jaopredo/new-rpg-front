
export type WeaponType = "custom" | "machineGun" | "pistol" | "shotgun" | "rifle" | "sniper" | "grenade" | "body"

export type Item = {
    _id: string,
    name: string,
    quantity: number,
    weight: number,
    weapon: boolean,
    details: string,
    damage: string,
    tipo: WeaponType,
    range: string
}

export interface InventoryType {
    items: Item[]
}