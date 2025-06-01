import { useAuthentication } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import useAPI from "./useApi"

const useFetchCart = () => {
    const { request } = useAPI();
    const { setItems } = useCart();
    const { user: token } = useAuthentication();
    const getCart = async () => {
        try {
            const response = await request({
                method: 'GET',
                url: "/api/Cart/GetCart",
                data: null,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(response.data || []);
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            throw new Error(errorMessage);
        }
    }

    return { getCart };
}

export default useFetchCart;