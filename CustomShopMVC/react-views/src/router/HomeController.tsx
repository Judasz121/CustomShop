import { Controller } from "react-bootstrap-icons";
import { IChoosableProperty, IMeasurableProperty } from "../types/categoryPropertyTypes";
import { ICategory } from "../types/categoryTypes";
import { IError } from "../types/errorTypes";
import { IProduct } from "../types/productTypes";
import Constants from "./constants";



export type GetCategoryChildrenResult = {
    success: boolean,
    children: ICategory[],
    formErrors: string[],
}

export type GetCategoriesCustomPropertiesResult = {
    success: boolean,
    formErrors: string[],
    choosableProperties: IChoosableProperty[],
    measurableProperties: IMeasurableProperty[],
}

export type GetMaxProductPriceInCategoriesResult = {
    succes: boolean,
    formErrors: string[],
    maxPrice: number,
}

export type GetAllProductsResult = {
    succcess: boolean,
    formErrors: IError[],
    products: IProduct[],
}

export class HomeController {
    private static controllerUrl = Constants.baseUrl + "/API/Home";

    public static GetCategoriesCustomProperties(categoriesId: string[]): GetCategoriesCustomPropertiesResult {
        let url = this.controllerUrl + "/GetCategoriesCustomProperties";
        let dataToSend = {
            categoriesId: categoriesId,
        }
        let result = fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json)

        console.log("fetch result");
        console.log(result);
        return {} as GetCategoriesCustomPropertiesResult;
    }

    public static GetCategoryChildren(categoryId: string): GetCategoryChildrenResult {
        let url = this.controllerUrl + "/GetCategoryChildren";
        let dataToSend = {
            categoryId: categoryId,
        }
        let result = fetch(url, {
            "method": "POST",
            body: JSON.stringify(dataToSend),
            "headers": {
                "content-type": "application/json",
            },
        })
            .then(response => response.json())
        console.log("fetch result");
        console.log(result);

        return {} as GetCategoryChildrenResult;
    }

    public static GetMaxProductPriceInCategories(categoriesId: string[]): GetMaxProductPriceInCategoriesResult {
        let url = this.controllerUrl + "/GetMaxProductPriceInCategories";
        let dataToSend = {
            categoriesId: categoriesId,
        };
        let result = fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())

        console.log("fetch result:");
        console.log(result);
        return {} as GetMaxProductPriceInCategoriesResult;
    }

    public static GetAllProducts(): GetAllProductsResult {

        return {} as GetAllProductsResult;
    }

}