import AxiosService from "."

import { returnAuthHeader } from "../func"

import { Item, InventoryType } from '@/types/'

export async function getInventory(charId: string) {
    const response = await AxiosService.get(`/inventory?charId=${charId}`, { headers: returnAuthHeader() })
    return response.data
}


export async function putItem(charId: string, data: Item) {
    const response = await AxiosService.put(`/inventory/item?charId=${charId}`, data, { headers: returnAuthHeader() })
    return response.data
}
export async function editItem(itemId: string, charId: string, quantity: number) {
    const response = await AxiosService.patch(`/inventory/item?charId=${charId}&itemId=${itemId}`, { quantity }, { headers: returnAuthHeader()})
    return response.data
}
export async function deleteItem(itemId: string, charId: string) {
    const response = await AxiosService.delete(`/inventory/item?charId=${charId}&itemId=${itemId}`, { headers: returnAuthHeader() })
    return response.data
}
