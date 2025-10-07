import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ProductDatails from "./components/product-datails";
import ProductHeader from "./components/product-header";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      restautante: {
        select: {
          slug: true,
          name: true,
          avatarImageUrl: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }
  if (product.restautante.slug.toUpperCase() !== slug.toUpperCase()) {
    return notFound();
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <ProductHeader product={product} />
        <ProductDatails product={product} />
      </div>
    </>
  );
};

export default ProductPage;
