import { IChoosableProperty, IMeasurableProperty } from "./categoryPropertyTypes";

export interface IProduct {
    id: string,
    authorId: string,
    ownerId: string,
    name: string,
    description: string,
    thumbnailImage: string,
    images: string[],
    choosablePropertiesValues: Record<string, string>,
    measurablePropertiesValues: Record<string, string>,
}