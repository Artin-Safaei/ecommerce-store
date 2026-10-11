import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to fetch category:", error);

    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}