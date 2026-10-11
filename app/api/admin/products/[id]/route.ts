
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      price?: number;
      stock?: number;
      featured?: boolean;
      categoryId?: string;
    } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { message: "Invalid product name." },
          { status: 400 }
        );
      }
      data.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      if (typeof body.slug !== "string" || !body.slug.trim()) {
        return NextResponse.json(
          { message: "Invalid product slug." },
          { status: 400 }
        );
      }
      data.slug = body.slug.trim().toLowerCase();
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          { message: "Invalid description." },
          { status: 400 }
        );
      }
      data.description = body.description.trim();
    }

    if (body.image !== undefined) {
      if (typeof body.image !== "string" || !body.image.trim()) {
        return NextResponse.json(
          { message: "Invalid image path." },
          { status: 400 }
        );
      }
      data.image = body.image.trim();
    }

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { message: "Invalid price." },
          { status: 400 }
        );
      }
      data.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          { message: "Invalid stock." },
          { status: 400 }
        );
      }
      data.stock = stock;
    }

    if (body.featured !== undefined) {
      if (typeof body.featured !== "boolean") {
        return NextResponse.json(
          { message: "Invalid featured value." },
          { status: 400 }
        );
      }
      data.featured = body.featured;
    }

    if (body.categoryId !== undefined) {
      if (typeof body.categoryId !== "string") {
        return NextResponse.json(
          { message: "Invalid category." },
          { status: 400 }
        );
      }

      const category = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Category not found." },
          { status: 400 }
        );
      }

      data.categoryId = body.categoryId;
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin product PATCH error:", error);

    return NextResponse.json(
      { message: "Failed to update product. Check that the slug is unique." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const [orderItems, wishlistItems] = await Promise.all([
      prisma.orderItem.count({ where: { productId: id } }),
      prisma.wishlistItem.count({ where: { productId: id } }),
    ]);

    if (orderItems > 0 || wishlistItems > 0) {
      return NextResponse.json(
        {
          message:
            "This product is referenced by existing orders or wishlists. Set its stock to zero or mark it unavailable instead of deleting it.",
        },
        { status: 409 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);

    return NextResponse.json(
      { message: "Failed to delete product." },
      { status: 500 }
    );
  }
}
