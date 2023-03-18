
export interface RollConfigsProps {
    faces: number,
    times: number,
    bonus?: number,
    advantage?: boolean,
    disadvantage?: boolean,
    action: "roll" | "damage" | "barragem"
}
