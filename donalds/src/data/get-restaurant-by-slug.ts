import { db } from "@/lib/prisma";

export const getRestauratBySlug = async (slug: string) => {
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  return restaurant;
};
