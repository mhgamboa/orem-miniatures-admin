import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = { storeId: string; categoryId: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });

    const category = await prismaDb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: { billboard: true },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, billboardId } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId) return new NextResponse("BillboardId is required", { status: 400 });
    if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const category = await prismaDb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_PATCH]", e);
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

    if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const category = await prismaDb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
