import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";

import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "../UI/table";
import { Button } from "../UI/button";
import { Dialog } from "../UI/dialog";
import OrderDetailss from "./OrderDetailss";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from "../../store/shop/order";
import { Badge } from "../UI/badge";

const Orders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUser(user.id));
    }
  }, [dispatch, user, getAllOrdersByUser]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  const fetchOrderDetails = (id) => {
    dispatch(getOrderDetails(id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell className="text-[16px]">{orderItem._id}</TableCell>
                  <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        orderItem.orderStatus === "confirmed"
                          ? "bg-green-600 hover:bg-green-700 px-4 py-1"
                          : "bg-yellow-700 hover:bg-yellow-800 px-5 py-1"
                      }
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{`$ ${orderItem.totalAmount}`}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={(isOpen) => {
                        setOpenDetailsDialog(isOpen);
                        if (!isOpen) {
                          dispatch(resetOrderDetails());
                        }
                      }}
                    >
                      <Button
                        onClick={() => {
                          setOpenDetailsDialog(true);
                          fetchOrderDetails(orderItem._id);
                        }}
                      >
                        View Details
                      </Button>
                      <OrderDetailss
                        openDetailsDialog={openDetailsDialog}
                        orderDetails={orderDetails}
                      />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;
