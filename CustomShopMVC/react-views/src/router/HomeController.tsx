import Constants from "./constants";

export class HomeController {
    private static controllerUrl = Constants.baseUrl + "/API/Home";

    public static GetCategoriesCustomProperties(categoriesId: string[]) {
        let url = this.controllerUrl + "/GetCategoriesCustomProperties";
        let dataToSend = {
            categoriesId: categoriesId,
        }
        return fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json)
    }

    public static GetCategoryChildren(categoryId: string) {
        let url = this.controllerUrl + "/GetCategoryChildren";
        let dataToSend = {
            categoryId: categoryId,
        }
        return fetch(url, {
            "method": "POST",
            body: JSON.stringify(categoryId),
            "headers": {
                "content-type": "application/json",
            },
        })
            .then(response => response.json())
    }
}