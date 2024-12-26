import React, { useEffect } from "react";
import { Card, CardContent, CardFooter } from "../UI/card";
import { Badge } from "../UI/badge";
import { brandMap, categoryMap } from "../config";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddCart,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto border-slate-300 drop-shadow-lg shadow-lg mt-5 hover:scale-105 transform transition-all">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded-full">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 truncate">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              {categoryMap[product?.category]}
            </span>
            <span className="text-sm text-gray-500">
              {brandMap[product?.brand]}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-red-600"
                  : "text-gray-800"
              } text-lg font-semibold`}
            >
              {product?.price}
            </span>

            {product?.salePrice > 0 ? (
              <span className="text-xl font-bold">{product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <button
          onClick={() => handleAddCart(product?._id)}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-md text-lg font-semibold transition-all duration-300"
        >
          Add to Cart
        </button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
