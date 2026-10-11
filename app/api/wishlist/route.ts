import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifySession(sessionToken);

  return session?.userId ?? null;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({
        id: null,
        items: [],
      });
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);

    return NextResponse.json(
      { message: "Failed to fetch wishlist." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const wishlist = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const existingItem =
      await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          },
        },
      });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      return NextResponse.json({
        message: "Product removed from wishlist.",
        wishlisted: false,
      });
    }

    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    return NextResponse.json({
      message: "Product added to wishlist.",
      wishlisted: true,
    });
  } catch (error) {
    console.error("Wishlist error:", error);

    return NextResponse.json(
      { message: "Failed to update wishlist." },
      { status: 500 }
    );
  }
}