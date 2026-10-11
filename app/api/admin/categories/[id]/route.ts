
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Only admins can edit categories.
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden: admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    // 2. Make sure the category exists.
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    // 3. Validate fields and build an update object.
    const updateData: {
      name?: string;
      slug?: string;
      description?: string | null;
      image?: string | null;
    } = {};

    if ("name" in data) {
      if (
        typeof data.name !== "string" ||
        !data.name.trim() ||
        data.name.trim().length > 100
      ) {
        return NextResponse.json(
          { message: "Name must be between 1 and 100 characters." },
          { status: 400 }
        );
      }

      updateData.name = data.name.trim();
    }

    if ("slug" in data) {
      if (
        typeof data.slug !== "string" ||
        data.slug.length > 120 ||
        !slugRegex.test(data.slug)
      ) {
        return NextResponse.json(
          {
            message:
              "Slug must contain lowercase letters, numbers, and single hyphens.",
          },
          { status: 400 }
        );
      }

      updateData.slug = data.slug;
    }

    if ("description" in data) {
      if (
        data.description !== null &&
        typeof data.description !== "string"
      ) {
        return NextResponse.json(
          { message: "Description must be a string or null." },
          { status: 400 }
        );
      }

      const description =
        typeof data.description === "string"
          ? data.description.trim()
          : "";

      if (description.length > 1000) {
        return NextResponse.json(
          { message: "Description cannot exceed 1000 characters." },
          { status: 400 }
        );
      }

      updateData.description = description || null;
    }

    if ("image" in data) {
      if (data.image !== null && typeof data.image !== "string") {
        return NextResponse.json(
          { message: "Image must be a string or null." },
          { status: 400 }
        );
      }

      const image =
        typeof data.image === "string" ? data.image.trim() : "";

      if (image.length > 2048) {
        return NextResponse.json(
          { message: "Image URL cannot exceed 2048 characters." },
          { status: 400 }
        );
      }

      updateData.image = image || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided to update." },
        { status: 400 }
      );
    }

    // 4. Check whether another category uses the same name or slug.
    if (updateData.name || updateData.slug) {
      const duplicate = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(updateData.slug
              ? [{ slug: updateData.slug }]
              : []),
            ...(updateData.name
              ? [
                  {
                    name: {
                      equals: updateData.name,
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
          ],
        },
        select: { id: true },
      });

      if (duplicate) {
        return NextResponse.json(
          { message: "Another category already uses this name or slug." },
          { status: 409 }
        );
      }
    }

    // 5. Save the changes.
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ category });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }

    console.error("PATCH /api/admin/categories/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Verify admin access.
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Forbidden: admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // 2. Check that the category exists.
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    // 3. Don't delete a category that still has products.
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete this category because it contains ${category._count.products} product(s). Move or delete those products first.`,
        },
        { status: 409 }
      );
    }

    // 4. Delete the empty category.
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 }
    );
  }
}
