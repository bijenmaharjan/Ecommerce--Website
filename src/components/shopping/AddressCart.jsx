import React, { useEffect } from "react";
import { Card, CardContent, CardFooter } from "../UI/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAddress } from "../../store/shop/address";

const AddressCart = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  currentSelectedAddress,
  setCurrentSelectedAddress,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  return (
    <Card
      className="relative p-4 rounded-md cursor-pointer transition-all duration-300"
      onClick={() => setCurrentSelectedAddress(addressInfo)}
    >
      <CardContent className="grid gap-4">
        <label className="">Address: {addressInfo?.address}</label>
        <label>City: {addressInfo?.city}</label>
        <label>Phone: {addressInfo?.phone}</label>
        <label>pincode: {addressInfo?.pincode}</label>
        <label>Notes: {addressInfo?.notes}</label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <button onClick={() => handleEditAddress(addressInfo)}>Edit</button>
        <button onClick={() => handleDeleteAddress(addressInfo)}>Delete</button>
      </CardFooter>
    </Card>
  );
};

export default AddressCart;
