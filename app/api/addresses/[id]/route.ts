import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const session = await verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: {
        id: address.id,
      },
    });

    return NextResponse.json({
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete address:", error);

    return NextResponse.json(
      { message: "Failed to delete address." },
      { status: 500 }
    );
  }
}