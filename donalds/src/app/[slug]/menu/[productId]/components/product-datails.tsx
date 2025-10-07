"use client";

import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { formatCurrency } from "@/app/helpers/format-currency";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDatailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restautante: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
    };
  }>;
}

const ProductDatails = ({ product }: ProductDatailsProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev == 1) {
        return prev;
      }

      return prev - 1;
    });
  };

  const handelIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="relative z-50 mt-[-1.5rem] flex flex-auto flex-col overflow-hidden rounded-t-3xl p-5">
      <div className="flex-auto overflow-hidden">
        <div>
          {/*RESTAURANTE*/}
          <div className="flex items-center gap-1.5">
            <Image
              src={product.restautante.avatarImageUrl}
              alt={product.restautante.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="text-muted-foreground text-xs">
              {product.restautante.name}
            </p>
          </div>

          {/*NOME DO PRODUTO*/}
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

          {/*PREÇO E QUANTIDADE*/}
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {formatCurrency(product.price)}
            </h3>
            <div className="flex items-center gap-3 text-center">
              <Button
                variant="outline"
                className="h-8 w-8 rounded-xl"
                onClick={handleDecreaseQuantity}
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-4">{quantity}</p>
              <Button
                variant="destructive"
                className="h-8 w-8 rounded-xl"
                onClick={handelIncreaseQuantity}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-full">
            {/*SOBRE*/}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Sobre</h4>
              <p className="text-muted-foreground text-sm">
                {product.description}
              </p>
            </div>

            {/*INGREDIENTES*/}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-1.5">
                <ChefHatIcon size={18} />
                <h4 className="font-semibold">Ingredientes</h4>
              </div>
              <ul className="text-muted-foreground list-disc px-5 text-sm">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>
      </div>

      <Button className="mt-6 w-full rounded-full">Adicionar à sacola</Button>
    </div>
  );
};

export default ProductDatails;
