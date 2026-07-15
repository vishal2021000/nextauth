import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import Video, { IVideo } from "@/models/Video";

export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch videos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const videoData = {
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      controls: body.controls ?? true,

      transformation: {
        width: body.transformation?.width ?? 1080,
        height: body.transformation?.height ?? 1920,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        data: newVideo,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating video:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create video",
      },
      {
        status: 500,
      }
    );
  }
}