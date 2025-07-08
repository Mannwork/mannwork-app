import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/get-categories";

import type {
    Category,
    CategorySearchResult,
} from "../types/categories.interface";

export function useCategories() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const searchCategories = (
        categories: Category[],
        query: string
    ): CategorySearchResult[] => {
        const searchResults: CategorySearchResult[] = [];
        const normalizedQuery = query.toLowerCase().trim();
        const addedSubcategories = new Set<string>(); // Para evitar duplicados

        categories.forEach((category) => {
            const isCategoryMatch = category.name
                .toLowerCase()
                .includes(normalizedQuery);

            // Si la categoría coincide o si estamos buscando en subcategorías
            category.sub_categories.forEach((subcategory) => {
                const isSubcategoryMatch = subcategory
                    .toLowerCase()
                    .includes(normalizedQuery);
                const key = `${category.name}-${subcategory}`;

                // Solo agregar si no hemos agregado esta combinación antes
                if (
                    !addedSubcategories.has(key) &&
                    (isCategoryMatch || isSubcategoryMatch)
                ) {
                    searchResults.push({
                        category: category.name,
                        subcategory,
                        isSubcategory: isSubcategoryMatch,
                    });
                    addedSubcategories.add(key);
                }
            });
        });

        return searchResults;
    };

    return {
        data,
        isLoading,
        error,
        searchCategories,
    };
}
