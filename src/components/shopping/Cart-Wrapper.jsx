import React, { useEffect } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../UI/sheet";
import CartItemsContent from "./Cart-items-content";
import { deleteCartItems, fetchCartItems } from "../../store/shop/cart";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CartWrapper = ({ cart, setOpenCardSheet }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch cart items when the user is available
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, user]);

  const totalCartAmount =
    cart && cart.length > 0
      ? cart.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md overflow-auto max-h-screen">
      <SheetHeader className="flex flex-row items-baseline justify-between">
        <SheetTitle>Your Cart</SheetTitle>
        <SheetTitle>Cart Products: {cart?.length} items</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cart?.length > 0 ? (
          cart.map((item) => <CartItemsContent key={item.id} cart={item} />)
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="mt-8 flex justify-between">
        <span className="font-bold">Total:</span>
        <span className="font-bold">{`$${totalCartAmount}`}</span>
      </div>
      <button
        onClick={() => {
          navigate(`/shop/Checkout`);
          setOpenCardSheet(false);
        }}
        className="w-full mt-6 py-2 rounded-md bg-blue-500 text-white"
      >
        Checkout
      </button>
    </SheetContent>
  );
};

export default CartWrapper;
