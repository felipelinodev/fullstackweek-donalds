"use server";
import { ConsumptionMethod } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateOrderInput {
  costumerName: string;
  costumerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;

  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });

  const productsWithPricesAndQuantity = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id == product.id)!.price,
  }));

  await db.order.create({
    data: {
      status: "PEDING",
      costumerName: input.costumerName,
      costumerCpf: removeCpfPunctuation(input.costumerCpf),
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantity,
        },
      },
      total: productsWithPricesAndQuantity.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });
  redirect(
    `/${input.slug}/orders?cpf=${removeCpfPunctuation(input.costumerCpf)}`,
  );
};
