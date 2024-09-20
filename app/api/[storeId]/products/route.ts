import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { name, price, images, categoryId, designerId, sizeId, isFeatured, isArchived } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!images || !images.length) return new NextResponse("images are required", { status: 400 });
    if (!price) return new NextResponse("price is required", { status: 400 });
    if (!categoryId) return new NextResponse("categoryId is required", { status: 400 });
    if (!designerId) return new NextResponse("designerId is required", { status: 400 });
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismaDb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        price,
        categoryId,
        designerId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    });

    // return new NextResponse(JSON.stringify(billboard), { status: 201 });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const designerId = searchParams.get("designerId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        designerId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: { images: true, category: true, size: true, designer: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
