import React from "react";
import { Dialog, DialogContent } from "../UI/dialog";
import { Separator } from "../UI/separator";
import { Avatar, AvatarFallback } from "../UI/avatar";
import { StarIcon } from "lucide-react";

const ProductDetails = ({ open, setOpen, productDetails, handleAddCart }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] rounded-lg bg-white shadow-lg">
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="grid gap-6">
          <div>
            <h1 className="text-4xl font-extrabold font-serif text-gray-800">
              {productDetails?.title}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p
              className={`text-3xl font-bold ${
                productDetails?.salePrice > 0
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-green-800">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5 text-yellow-400">
              <StarIcon className="fill-yellow-400" />
              <StarIcon className="fill-yellow-400" />
              <StarIcon className="fill-yellow-400" />
              <StarIcon className="fill-yellow-400" />
              <StarIcon className="fill-yellow-400" />
            </div>
            <span className="text-gray-500">(4.5)</span>
          </div>
          <div className="mt-5">
            <button
              onClick={() => handleAddCart(productDetails?._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-lg transition-all"
            >
              Add to Cart
            </button>
          </div>
          <Separator className="my-6" />
          <div className="max-h-[300px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4 items-start">
                <Avatar className="w-12 h-12 border rounded-full shadow-md">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">Aleb Joa</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      <StarIcon className="fill-yellow-400" />
                      <StarIcon className="fill-yellow-400" />
                      <StarIcon className="fill-yellow-400" />
                      <StarIcon className="fill-yellow-400" />
                      <StarIcon className="fill-yellow-400" />
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "This is an awesome product"
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input
              placeholder="Write a review..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
              Submit
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
