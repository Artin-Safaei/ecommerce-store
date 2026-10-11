
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/admin";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin products GET error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const image =
      typeof body.image === "string" ? body.image.trim() : "";

    const categoryId =
      typeof body.categoryId === "string"
        ? body.categoryId
        : "";

    const price = Number(body.price);
    const stock = Number(body.stock);
    const featured = body.featured === true;

    if (
      !name ||
      !slug ||
      !description ||
      !image ||
      !categoryId
    ) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { message: "Invalid price or stock value." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { name: { equals: name, mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "A product with this name or slug already exists." },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        image,
        price,
        stock,
        featured,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Admin products POST error:", error);

    return NextResponse.json(
      { message: "Failed to create product." },
      { status: 500 }
    );
  }
}
