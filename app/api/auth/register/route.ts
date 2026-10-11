import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        passwordHash,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while creating the account.",
      },
      {
        status: 500,
      }
    );
  }
}