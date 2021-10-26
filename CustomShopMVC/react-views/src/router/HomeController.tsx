import { Controller } from "react-bootstrap-icons";
import { IChoosableProperty, IMeasurableProperty } from "../types/categoryPropertyTypes";
import { ICategory } from "../types/categoryTypes";
import { IError } from "../types/errorTypes";
import { IProduct } from "../types/productTypes";
import Constants from "./constants";



export type GetCategoryChildrenResult = {
    success: boolean,
    childrenCategories: ICategory[],
    errors: IError[],
}

export type GetCategoriesCustomPropertiesResult = {
    success: boolean,
    errors: string[],
    choosableProperties: IChoosableProperty[],
    measurableProperties: IMeasurableProperty[],
}

export interface GetMaxProductPriceInCategoriesResult {
    success: boolean,
    errors: string[],
    maxPrice: number,
}

export type GetAllProductsResult = {
    success: boolean,
    errors: IError[],
    products: IProduct[],
}

export type GetAllCategoriesResult = {
    success: boolean,
    errors: IError[],
    categories: ICategory[],
}

export class HomeController {
    private static controllerUrl = Constants.baseUrl + "/API/Home";

    public static async GetAllCategories(): Promise<GetAllCategoriesResult> {
        let url = this.controllerUrl + "/GetAllCategories";
        return await fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
        })
            .then(response => response.json())
    }

    public static async GetCategoriesCustomProperties(categoriesId: string[]): Promise<GetCategoriesCustomPropertiesResult> {
        let url = this.controllerUrl + "/GetCategoriesCustomProperties";
        let result = {} as GetCategoriesCustomPropertiesResult;
        let dataToSend = {
            categoriesId: categoriesId,
        }
        return await fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            ;
    }

    public static async GetCategoryChildren(categoryId: string): Promise<GetCategoryChildrenResult> {
        let url = this.controllerUrl + "/GetCategoryChildren";
        let result = {} as GetCategoryChildrenResult;
        let dataToSend = {
            categoryId: categoryId,
        }
        return await fetch(url, {
            "method": "POST",
            body: JSON.stringify(dataToSend),
            "headers": {
                "content-type": "application/json",
            },
        })
            .then(response => response.json())
        ;
    }

    public static async GetMaxProductPriceInCategories(categoriesId: string[]): Promise<GetMaxProductPriceInCategoriesResult>{
        let url = this.controllerUrl + "/GetMaxProductPriceInCategories";
        let result = {} as GetMaxProductPriceInCategoriesResult;
        let dataToSend = {
            categoriesId: categoriesId,
        };

        return await fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            ;
    }

    public static async GetAllProducts(): Promise<GetAllProductsResult> {
        let url = this.controllerUrl + "/GetAllProducts";
        let result = {} as GetAllProductsResult;
        return await fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
        })
            .then(response => response.json())
            ;
    }

}