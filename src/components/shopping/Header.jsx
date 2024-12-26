import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../UI/sheet";
import { useDispatch, useSelector } from "react-redux";
import { shoppingMenuItems } from "../config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../UI/dropdown-menu";
import { Avatar, AvatarFallback } from "../UI/avatar";
import { logoutUser } from "../../store/authorization-slice/auths";
import CartWrapper from "./Cart-Wrapper";
import { fetchCartItems } from "../../store/shop/cart";

const MenuItems = () => {
  const navigate = useNavigate();

  function handleNavigate(getCurrentItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentItem.id !== "home"
        ? {
            category: [getCurrentItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate(getCurrentItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingMenuItems.map((menuItem) => (
        <button
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium"
          key={menuItem.id}
        >
          {menuItem.label}
        </button>
      ))}
    </nav>
  );
};

const HeaderDropdown = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCardSheet] = useState(false);

  useEffect(() => {
    console.log("User ID:", user?.id);
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const handleLogout = () => dispatch(logoutUser());

  return (
    <div className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCardSheet(false)}>
        <button
          onClick={() => setOpenCardSheet(true)}
          variant="outline"
          size="icon"
        >
          <ShoppingCart className="w-6 h-6 text-orange-400" />
          <span className="sr-only">User cart</span>
        </button>
        <CartWrapper
          setOpenCardSheet={setOpenCardSheet}
          cart={cart && cart.items && cart.items.length > 0 ? cart.items : []}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-slate-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6 " />
          <span className="font-bold">Ecommerce</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <button>
              <Menu
                variant="outline"
                size="icon"
                className="lg:hidden h-6 w-6"
              />
              <span className="sr-only">Toggle header menu</span>
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs ">
            <MenuItems />
            <HeaderDropdown />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderDropdown />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
