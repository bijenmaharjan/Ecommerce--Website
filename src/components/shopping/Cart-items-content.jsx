import { Minus, Plus, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQuantity } from "../../store/shop/cart";
import { deleteCartItems } from "../../store/shop/cart";
import { fetchCartItems } from "../../store/shop/cart";
import { toast } from "../../hooks/use-toast";

const Cartitemscontent = ({ cart }) => {
  console.log("handleCartItemDelete", handleCartItemDelete);
  console.log("carss", cart?.productId);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { product } = useSelector((state) => state.shopproducts);
  const updateCartItemsQuantity = (getItems, stringvalueAction) => {
    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: getItems?.productId,
        quantity:
          stringvalueAction === "plus"
            ? getItems?.quantity + 1
            : getItems?.quantity - 1,
      })
    );
  };

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItems({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ">
      <img
        className="w-24 h-24 rounded-md object-cover transform transition-transform duration-300 hover:scale-105"
        src={cart?.image}
        alt={cart?.title}
      />

      <div className="flex flex-col flex-1 space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{cart?.title}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <button
            disabled={cart?.quantity === 1}
            onClick={() => updateCartItemsQuantity(cart, "minus")}
            className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
          >
            <Minus className="w-4 h-4 text-gray-700" />
            <span className="sr-only">Decrease</span>
          </button>
          <span className="font-semibold text-gray-800 text-lg">
            {(cart && cart?.quantity) || 0}
          </span>
          <button
            onClick={() => updateCartItemsQuantity(cart, "plus")}
            className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-gray-700" />
            <span className="sr-only">Increase</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold text-lg text-gray-900">
          $
          {(
            (cart?.salePrice > 0 ? cart.salePrice : cart.price || 0) *
            (cart.quantity || 1)
          ).toFixed(2)}
        </p>

        <Trash
          onClick={() => handleCartItemDelete(cart)}
          className="cursor-pointer mt-2 text-red-500 hover:text-red-600 transition-colors duration-200"
        />
      </div>
    </div>
  );
};

export default Cartitemscontent;
