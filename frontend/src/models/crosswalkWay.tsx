import { CrosswalkNode } from "./crosswalkNode"

export type CrosswalkWay = {
    id : number,
    nodes : CrosswalkNode[],
    angle? : number
}