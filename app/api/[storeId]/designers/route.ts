import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { name, website, patreon } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!website) return new NextResponse("Website is required", { status: 400 });
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const designers = await prismaDb.designer.create({
      data: {
        name,
        website,
        patreon,
        storeId: params.storeId,
      },
    });

    // return new NextResponse(JSON.stringify(billboard), { status: 201 });
    return NextResponse.json(designers);
  } catch (error) {
    console.log("[DESIGNERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return new NextResponse("storeId is required", { status: 400 });

    const designers = await prismaDb.designer.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(designers);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
