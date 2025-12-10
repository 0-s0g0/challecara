"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "./ui/chart"
import { IDEA_TAGS } from "@/app/domain/models/ideaTags"
import type { CategoryCount } from "@/app/domain/models/profileView"

interface IdeaPieChartProps {
  data: CategoryCount[]
}

export function IdeaPieChart({ data }: IdeaPieChartProps) {
  const chartData = data.map((item) => ({
    name: IDEA_TAGS[item.category].name,
    value: item.count,
    color: IDEA_TAGS[item.category].color,
  }))

  const chartConfig = data.reduce(
    (acc, item) => {
      acc[item.category] = {
        label: IDEA_TAGS[item.category].name,
        color: IDEA_TAGS[item.category].color,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={80}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
