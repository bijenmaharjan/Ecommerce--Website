const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res
      .status(200)
      .json({ success: true, data: cart, message: "Product added to Cart." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user id is manadatory" });
    }
    const cart = await cartModel.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCardItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCardItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in fetch cart",
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // if the userId,productId and quantity has not received datas or null,undefined from the front end
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    //This will check the cart exists or not from the login Users id
    const cart = await cartModel.findOne({
      userId,
    });

    //if by default value of login user id cart or cart is not there this will shows the error
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    //This will checks if already present product id matches with the incomming product id
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    //If the existed product id id not matched with the incoming product id so it will be -1.
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present",
      });
    }

    //This will acces the cartitems product quantity and assign with the new quantity
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    //Using the populate we can just select the keys what we want to get and display it
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    //accessing item.productId.image, item.productId.title, etc., because those properties come from the populated productId field.
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    //If true it gonna send this cart datas at frontend
    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in adding to cart",
    });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if ((!userId, !productId)) {
      return res.status(400).json({
        success: false,
        message: "Data not received or Invalid!",
      });
    }

    const cart = await cartModel.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return (
        res.status(404),
        json({
          success: false,
          message: "Cart not found",
        })
      );
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in deleting Cart",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  deleteCartItems,
  updateCartItemQuantity,
};
