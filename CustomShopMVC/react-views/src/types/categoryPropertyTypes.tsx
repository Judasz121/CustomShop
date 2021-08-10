export interface IChoosableProperty {
    id: string,
    categoryId: string,
    propertyName: string,
    propertyNameAbbreviation: string,
    itemsToChoose: string[],
}

export interface IMeasurableProperty {
    id: string,
    categoryId: string,
    propertyName: string,
    propertyNameAbbreviation: string,
    unitName: string,
    unitFullName: string,
    isMetric: boolean,
    toMetricModifier: number | null
}