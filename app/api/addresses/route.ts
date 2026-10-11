import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifySession(sessionToken);

  if (!session) {
    return null;
  }

  return session.userId;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);

    return NextResponse.json(
      { message: "Failed to fetch addresses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
      country,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !country
    ) {
      return NextResponse.json(
        { message: "All address fields are required." },
        { status: 400 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        userId,
      },
    });

    return NextResponse.json(
      {
        message: "Address created successfully.",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create address:", error);

    return NextResponse.json(
      { message: "Failed to create address." },
      { status: 500 }
    );
  }
}