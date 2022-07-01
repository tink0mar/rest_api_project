import Collections from "../models/Collections"
import Items from "../models/Items"

export interface CollectionParams {
    id: number
}

export interface CreateCollectionReq {
    name: string
}

export interface CreateCollectionRes {
    userId: number | undefined,
    collectionName: string,
    collectionId: number
}

export interface ChangeCollectionReq {
    name: string
}

export interface ChangeCollectionRes {
    userId: number,
    collectionName: string,
    collectionId: number
}

export interface ListCollectionsRes {
    userId: number | undefined,
    data: {
        collections: Array<number>;
    }
}

export interface GetCollectionRes {
    userId: number | undefined
    collectionName: string
    collectionId: number
    type: "collection"
    data: {
        stories: Array<number>
    }
}

export interface AddStoriesToCollectionReq {
    ids?: Array<number>;
}

export interface AddStoriesToCollectionRes {
    userId: number | undefined,
    collectionId: number,
    collectionName: string,
    type: "collection",
    data: {
        stories: Array<number>
    }
}

export interface ItemParams {
    id: number
}

export interface GetItemRes{
    id: number
    parentId: number
    content: string
    author: string
    time: number
    type: string
    collections?: Array<number>
    kids?: Array<number> | Array<GetItemRes>
}

export interface Item {
    id: number,
    by: string,
    kids: number[],
    title?: string,
    text?: string,
    type: string,
    parent: number,
    time: number
}

// Get Items interface extends Items, adding collection parameter
export interface GetItems extends Items {
    collections?: Array<Collections>
}
