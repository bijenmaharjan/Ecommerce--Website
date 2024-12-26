import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import Form from "../common/Form";
import { addressFormControls } from "../config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "../../store/shop/address";
import { toast } from "../../hooks/use-toast";
import { useEffect } from "react";
import AddressCart from "./AddressCart";
import { Variable } from "lucide-react";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({ setCurrentSelectedAddress }) => {
  //useState for addressFormData
  const [addressFormData, setAddressFormData] = useState(
    initialAddressFormData
  );
  const [addressId, setAddressid] = useState(null);
  const { address } = useSelector((state) => state.address);
  console.log("addresscart", address);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /* Handiling onSubmit Address */
  function handleAddress(e) {
    e.preventDefault();

    //User can add only 2 addresses

    if (address.length >= 2 && addressId === null) {
      toast({
        title: "You can add only 2 addresses",
        variant: "destructive",
      });
      setAddressFormData(initialAddressFormData);
      return;
    }

    addressId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressID: addressId,
            formData: addressFormData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            toast({
              title: "Address updated Successfully",
            });
            dispatch(fetchAllAddress(user?.id));
            setAddressid(null);
            setAddressFormData(initialAddressFormData);
          }
        })
      : dispatch(addNewAddress({ ...addressFormData, userId: user?.id })).then(
          (data) => {
            if (data?.payload?.success) {
              toast({
                title: "Address Successfully added",
              });
              dispatch(fetchAllAddress(user?.id));

              setAddressFormData(initialAddressFormData);
            }
          }
        );
  }
  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  //handling form is field or not
  function isFormValid() {
    return Object.keys(addressFormData)
      .map((key) => addressFormData[key] !== "")
      .every((items) => items);
  }

  // handle Delete address
  const handleDeleteAddress = (addressitems) => {
    dispatch(
      deleteAddress({ userId: user?.id, addressID: addressitems._id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Address deleted Successfully",
        });
        dispatch(fetchAllAddress(user?.id));
      }
    });
  };

  //handle edit address
  const handleEditAddress = (getEditItems) => {
    setAddressid(getEditItems._id);
    setAddressFormData({
      ...addressFormData,
      address: getEditItems?.address,
      city: getEditItems?.city,
      state: getEditItems?.state,
      pincode: getEditItems?.pincode,
      phone: getEditItems?.phone,
      notes: getEditItems?.notes,
    });
  };

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
        {address && address.length > 0
          ? address.map((adinfo, index) => (
              <AddressCart
                key={index}
                addressInfo={adinfo}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {addressId !== null ? "Edit Address" : "Add Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Form
          formControls={addressFormControls}
          formData={addressFormData}
          setFormData={setAddressFormData}
          buttonText={addressId !== null ? "Edit" : "Add"}
          onSubmit={handleAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
