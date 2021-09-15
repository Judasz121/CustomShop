

export interface IProduct {
    id: string,
    authorId: string,
    ownerId: string,
    name: string,
    description: string,
    newThumbnailImage: File,
    thumbnailImagePath: string,
    newImages: File[],
    imagesPath: string[],
    quantity: number,
    // property key is an id of a property object ( not the id of a propertyValue object)
    choosablePropertiesValues: Record<string, string>,
    measurablePropertiesValues: Record<string, string>,
}

export interface IProductEdit extends IProduct {
    newThumbnailImage: File,
    newImages: File[],
    imagesToDelete: string[],
}