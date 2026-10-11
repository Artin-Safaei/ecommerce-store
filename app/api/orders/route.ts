import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const session = await verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { message: "Your session is invalid or expired." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "You must be logged in to place an order." },
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

    // 3. Read request body
    const body = await request.json();

    const {
      addressId,
      items,
    }: {
      addressId: string;
      items: OrderItemInput[];
    } = body;

    // 4. Validate request
    if (!addressId) {
      return NextResponse.json(
        { message: "Address is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 }
      );
    }

    // 5. Validate quantities
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { message: "Invalid cart items." },
          { status: 400 }
        );
      }
    }

    // 6. Make sure address belongs to current user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 }
      );
    }

    // 7. Get real products from database
    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { message: "One or more products no longer exist." },
        { status: 400 }
      );
    }

    // 8. Validate stock
    for (const item of items) {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `${product.name} does not have enough stock.`,
          },
          { status: 400 }
        );
      }
    }

    // 9. Calculate subtotal on server
    const subtotal = items.reduce((total, item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        return total;
      }

      return total + product.price * item.quantity;
    }, 0);

    // Free shipping for now
    const shipping = 0;

    const total = subtotal + shipping;

    // 10. Create order + items + decrease stock
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: session.userId,
          addressId: address.id,
          subtotal,
          shipping,
          total,
          items: {
            create: items.map((item) => {
              const product = products.find(
                (product) => product.id === item.productId
              )!;

              return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      // Decrease stock
      for (const item of items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}