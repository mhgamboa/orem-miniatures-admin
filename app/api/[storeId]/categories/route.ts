import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { name, billboardId } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId) return new NextResponse("BillboardId is required", { status: 400 });
    if (!params.storeId) return new NextResponse("StoreId is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismaDb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    //Alternatively: return new NextResponse(JSON.stringify(category), { status: 201 });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });

    const categories = await prismaDb.category.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
