import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = { storeId: string; designerId: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    if (!params.designerId) return new NextResponse("Designer ID is required", { status: 400 });

    const designer = await prismaDb.designer.findUnique({
      where: {
        id: params.designerId,
      },
    });

    return NextResponse.json(designer);
  } catch (e) {
    console.log("[DESIGNER_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, website, patreon } = body;
    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!name) return new NextResponse("Label is required", { status: 400 });
    if (!website) return new NextResponse("Website is required", { status: 400 });
    if (!params.designerId) return new NextResponse("Designer ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const designer = await prismaDb.designer.updateMany({
      where: {
        id: params.designerId,
      },
      data: {
        name,
        website,
        patreon,
      },
    });

    return NextResponse.json(designer);
  } catch (e) {
    console.log("[DESIGNER_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    if (!params.designerId) return new NextResponse("Designer ID is required", { status: 400 });
    if (!storeByUserId) return new NextResponse("Unauthrozied", { status: 403 });

    const color = await prismaDb.designer.deleteMany({
      where: {
        id: params.designerId,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[DESIGNER_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
