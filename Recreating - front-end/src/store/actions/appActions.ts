import { AppDispatch } from "@/store";
import { fetchWithoutAuth } from "@/lib/auth";

export const appActions = () => async (dispatch: AppDispatch) => {
    try {
        const [banner, categories, deal, groceryCategory] = await Promise.all([
            fetchWithoutAuth('/api/banner'),
            fetchWithoutAuth('/api/categories'),
            fetchWithoutAuth('/api/deal'),
            fetchWithoutAuth('/api/grocery-category'),
        ]);

        console.log({ banner, categories, deal, groceryCategory })

        // if (banner && banner?.data) {
        //     dispatch(setbannerItems(banner.data));
        // }

        // if (categories && categories?.data) {
        //     dispatch(setcategoriesData(categories.data));
        // }

        // if (deal && deal?.data) {
        //     dispatch(setDeal(deal.data));
        // }

        // if (groceryCategory && groceryCategory?.data) {
        //     dispatch(setGroceryCategory(groceryCategory.data));
        // }
    } catch (err) {
        console.error("Failed to fetch user data:", err);
    }
};
