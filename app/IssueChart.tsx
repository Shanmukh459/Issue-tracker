"use client"

import { Card } from "@radix-ui/themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import React from "react"

interface Props {
  open: number
  inProgress: number
  closed: number
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: "Open", value: open },
    { label: "InProgress", value: inProgress },
    { label: "Closed", value: closed },
  ]
  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={60} style={{ fill: "var(--accent-9)" }}>
          <XAxis dataKey="label" />
          <YAxis />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default IssueChart
