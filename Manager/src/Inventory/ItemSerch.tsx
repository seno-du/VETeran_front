import { useState, useCallback } from 'react';
import axios from 'axios';

interface Location {
    itemId: string;
    itemName: string;
    itemCategory: string;
    itemPrice: number;
    remainingStock: number;
}

interface ItemList {
    totalRemainingStock: number;
    locations: Location[];
}

const useFetchItems = (searchValue: string) => {
    const [locationList, setLocationList] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        if (!searchValue) {
            setLocationList([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // itemId 또는 itemName에 따라 API를 다르게 호출
            const isItemId = searchValue.match(/^\d+$/); // itemId는 숫자만 포함된 값으로 가정
            const url = isItemId
                ? `http://localhost:7124/back/api/itemhistory/itemid/${searchValue}`
                : `http://localhost:7124/back/api/itemhistory/itemname/${searchValue}`;

            const response = await axios.get<ItemList>(url);
            setLocationList(response.data.locations);
        } catch (err) {
            setError('Error fetching items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchValue]);

    return {
        locationList,
        loading,
        error,
        fetchItems
    };
};

export default useFetchItems;
