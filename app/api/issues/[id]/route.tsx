import { authOptions } from "@/app/auth/authOptions"
import { patchIssueSchema } from "@/app/validationSchemas"
import prisma from "@/prisma/client"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

  const body = await request.json()
  const validation = patchIssueSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const { title, description, assignedToUserId } = body
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    })
    if (!user)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 })
  }

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!issue) {
    console.log("Issue not found")
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 })
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(params.id) },
    data: {
      title,
      description,
      assignedToUserId,
    },
  })

  return NextResponse.json(updatedIssue, { status: 201 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 })

  await prisma.issue.delete({
    where: { id: parseInt(params.id) },
  })

  return NextResponse.json({})
}
