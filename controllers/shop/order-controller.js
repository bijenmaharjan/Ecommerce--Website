const paypal = require("../../helpers/paypal");
const orderModel = require("../../models/orderModel");
const cartModel = require("../../models/cartModel");
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartitems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;
    console.log(req.body);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartitems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price:
                item.salePrice > 0
                  ? item.salePrice.toFixed(2)
                  : item.price.toFixed(2),
              currency: "USD", // Ensure the currency is correct
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD", // Ensure this matches the item prices
            total: totalAmount.toFixed(2), // Ensure total is a valid string with two decimals
          },
          description: `Order from ${cartitems.length} items.`,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "Error creating PayPal payment",
          error: error.response || error.message || error,
        });
      } else {
        console.log("PayPal Payment Info:", paymentInfo);

        const newlyCreatedOrder = await orderModel.create({
          userId,
          cartId,
          cartitems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        )?.href;

        if (!approvalURL) {
          return res.status(400).json({ message: "Approval URL not found" });
        }

        res.status(201).json({
          success: true,
          message: "Order created successfully",
          orderId: newlyCreatedOrder?._id,
          approvalURL,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
      success: false,
    });
  }
};

const capturePayment = async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;
  console.log("capturePayment", req.body);

  try {
    const checkOrder = await orderModel.findById(orderId);
    if (!checkOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not Found.",
      });
    }
    checkOrder.paymentStatus = "paid";
    checkOrder.orderStatus = "confirmed";
    checkOrder.paymentId = paymentId;
    checkOrder.payerId = payerId;

    const getCart = checkOrder.cartId;
    console.log("cartModel", getCart);

    await cartModel.findByIdAndDelete(getCart);

    await checkOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      data: checkOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error capturing payment",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `No orders Found.${error}`,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("iddd", id);

    const orderDetails = await orderModel.findById(id);
    // console.log("orderDetails", orderDetails);

    if (!orderDetails) {
      res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order Detail Not Found.",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
