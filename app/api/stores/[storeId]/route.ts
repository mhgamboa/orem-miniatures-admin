import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismaDb.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Req is required as Params is only available as the 2nd argument
export async function DELETE(_req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismaDb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
