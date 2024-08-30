import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { name, value } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const colors = await prismaDb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    // return new NextResponse(JSON.stringify(billboard), { status: 201 });
    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });

    const colors = await prismaDb.color.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
