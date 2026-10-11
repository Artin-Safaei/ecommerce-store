
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/admin";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden: admin access required." },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin categories GET error:", error);

    return NextResponse.json(
      { message: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden: admin access required." },
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

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Category name and slug are required." },
        { status: 400 }
      );
    }

    if (name.length > 100 || slug.length > 120) {
      return NextResponse.json(
        { message: "Category name or slug is too long." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          message:
            "Slug must contain lowercase letters, numbers, and single hyphens.",
        },
        { status: 400 }
      );
    }

    if (description.length > 1000 || image.length > 2048) {
      return NextResponse.json(
        { message: "Description or image URL is too long." },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug },
          { name: { equals: name, mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { message: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
      },
    });

    return NextResponse.json(
      { message: "Category created successfully.", category },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "This category name or slug already exists." },
        { status: 409 }
      );
    }

    console.error("Admin categories POST error:", error);

    return NextResponse.json(
      { message: "Failed to create category." },
      { status: 500 }
    );
  }
}
