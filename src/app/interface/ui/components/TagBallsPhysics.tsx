"use client"

import { IDEA_TAGS, type IdeaTag } from "@/app/domain/models/ideaTags"
import Matter from "matter-js"
import { useEffect, useRef } from "react"

interface TagBallsPhysicsProps {
  tagCounts: Array<{ tag: IdeaTag; count: number }>
  width: number
  height: number
}

export function TagBallsPhysics({ tagCounts, width, height }: TagBallsPhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !tagCounts || tagCounts.length === 0) return

    // matter.jsのモジュール
    const Engine = Matter.Engine
    const Render = Matter.Render
    const Runner = Matter.Runner
    const Bodies = Matter.Bodies
    const Composite = Matter.Composite

    // エンジンの作成
    const engine = Engine.create()
    engineRef.current = engine

    // 重力を設定
    engine.gravity.y = 0.5

    // レンダラーの作成
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    })
    renderRef.current = render

    // 壁を作成
    const wallThickness = 50
    const walls = [
      // 下
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      // 左
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      // 右
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
    ]

    // タグボールを作成
    const balls = tagCounts.map((tagCount, index) => {
      const tagInfo = IDEA_TAGS[tagCount.tag]
      // サイズを投稿数に応じて変更（最小20px、最大40px半径）
      const radius = Math.min(40, Math.max(20, 20 + tagCount.count * 4))

      // ボールの初期位置（上からランダムに配置）
      const x = (width / (tagCounts.length + 1)) * (index + 1) + (Math.random() - 0.5) * 50
      const y = -50 - index * 60 // 上から順番に落ちてくる

      // グラデーションから単色を抽出（簡易的に）
      // TODO: カスタムレンダリングでグラデーションを実装
      const color = tagInfo.gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] || "#6366f1"

      return Bodies.circle(x, y, radius, {
        restitution: 0.6, // 弾性
        friction: 0.001,
        render: {
          fillStyle: color,
        },
        // カスタムデータを保存
        label: JSON.stringify({
          tag: tagCount.tag,
          count: tagCount.count,
          icon: tagInfo.icon,
        }),
      })
    })

    // ワールドに追加
    Composite.add(engine.world, [...walls, ...balls])

    // レンダラーとエンジンを起動
    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    // クリーンアップ
    return () => {
      Render.stop(render)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [tagCounts, width, height])

  // カスタムレンダリングでテキストとアイコンを描画
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const engine = engineRef.current

    const renderFrame = () => {
      // matter.jsのレンダラーが既に描画しているので、その上にテキストを追加
      const bodies = Matter.Composite.allBodies(engine.world)

      bodies.forEach((body) => {
        if (body.isStatic) return

        try {
          const data = JSON.parse(body.label)
          const { icon, count } = data

          // アイコンとカウントを描画
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          // テキストのスタイル
          ctx.fillStyle = "white"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          // アイコン
          ctx.font = `${body.circleRadius ? body.circleRadius * 0.8 : 20}px Arial`
          ctx.fillText(icon, 0, -5)

          // カウント
          ctx.font = `${body.circleRadius ? body.circleRadius * 0.4 : 12}px Arial`
          ctx.fillText(count.toString(), 0, body.circleRadius ? body.circleRadius * 0.4 : 10)

          ctx.restore()
        } catch (_error) {
          // ラベルがJSON形式でない場合はスキップ
        }
      })

      requestAnimationFrame(renderFrame)
    }

    const animationId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [tagCounts])

  if (!tagCounts || tagCounts.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <p className="text-sm text-gray-400">まだ投稿がありません</p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
