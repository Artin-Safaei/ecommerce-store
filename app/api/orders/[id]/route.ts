import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // 1. Get session cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // 2. Verify JWT
    const session = await verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { message: "Your session is invalid or expired." },
        { status: 401 }
      );
    }

    // 3. Get order ID from URL
    const { id } = await context.params;

    // 4. Find the order
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.userId,
      },
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 5. Order doesn't exist or doesn't belong to this user
    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // 6. Return order
    return NextResponse.json(order);
  } catch (error) {
    console.error("Get order error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order." },
      { status: 500 }
    );
  }
}