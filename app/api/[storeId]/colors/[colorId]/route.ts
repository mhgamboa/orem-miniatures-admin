import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = { storeId: string; colorId: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });

    const color = await prismaDb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, value } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!name) return new NextResponse("Label is required", { status: 400 });
    if (!value) return new NextResponse("Image URL is required", { status: 400 });
    if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const color = await prismaDb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_PATCH]", e);
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

    if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const color = await prismaDb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
