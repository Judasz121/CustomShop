export interface IChoosableProperty extends ICategoryProductProperty {
    itemsToChoose: string[],
}

export interface IMeasurableProperty extends ICategoryProductProperty {

    unitName: string,
    unitFullName: string,
    isMetric: boolean,
    toMetricModifier: number | null
}

export interface ICategoryProductProperty {
    id: string,
    categoryId: string,
    propertyName: string,
    propertyNameAbbreviation: string,
}