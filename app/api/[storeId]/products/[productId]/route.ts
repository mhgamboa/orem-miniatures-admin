import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = { storeId: string; productId: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });

    const product = await prismaDb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: { Image: true, category: true, size: true, color: true },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    const body = await req.json();
    const { name, price, images, categoryId, colorId, sizeId, isFeatured, isArchived } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images || !images.length) return new NextResponse("images are required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });
    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        Image: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        Image: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[STORE_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Req is required as Params is only available as the 2nd argument
export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const product = await prismaDb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
