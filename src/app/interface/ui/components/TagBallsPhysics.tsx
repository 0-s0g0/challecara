"use client"

import { useEffect, useRef } from "react"
import Matter from "matter-js"
import { IDEA_TAGS, type IdeaTag } from "@/app/domain/models/ideaTags"

interface TagCount {
  tag: IdeaTag
  count: number
}

interface TagBallsPhysicsProps {
  tagCounts: TagCount[]
  width?: number
  height?: number
}

export function TagBallsPhysics({ tagCounts, width = 400, height = 300 }: TagBallsPhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  useEffect(() => {
    console.log("TagBallsPhysics mounted!", { tagCounts, width, height })
    if (!canvasRef.current) {
      console.log("Canvas ref not ready")
      return
    }

    const canvas = canvasRef.current
    console.log("Canvas element:", canvas)
    console.log("Canvas dimensions:", canvas.width, canvas.height)

    try {
      console.log("Creating Matter.js engine...")
      // Matter.jsのエンジンとレンダラーを作成
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1 }, // scale削除してデフォルト重力を使用
      })
      engineRef.current = engine
      console.log("Engine created", engine)

      console.log("Creating Matter.js render...")
      const render = Matter.Render.create({
        canvas: canvasRef.current,
        engine: engine,
        options: {
          width,
          height,
          wireframes: true, // デバッグ用に一時的にtrue
          background: "#f0f0f0",
        },
      })
      renderRef.current = render
      console.log("Render created", render)
      console.log("Render canvas:", render.canvas)
      console.log("Render context:", render.context)

      // 壁を作成
      const wallOptions = { isStatic: true, render: { fillStyle: "transparent" } }
      const walls = [
        Matter.Bodies.rectangle(width / 2, 0, width, 10, wallOptions), // 上
        Matter.Bodies.rectangle(width / 2, height, width, 10, wallOptions), // 下
        Matter.Bodies.rectangle(0, height / 2, 10, height, wallOptions), // 左
        Matter.Bodies.rectangle(width, height / 2, 10, height, wallOptions), // 右
      ]

      // タグボールを作成
      const balls = tagCounts.map((tagCount, index) => {
        const tagInfo = IDEA_TAGS[tagCount.tag]
        // カウント数に応じてサイズを変更（最小20、最大60）
        const radius = Math.min(Math.max(20 + tagCount.count * 10, 20), 60)

        // ランダムな初期位置（画面内の上部から）
        const x = radius + Math.random() * (width - radius * 2)
        const y = radius + index * 5 // 画面内から少しずつ間隔を空けて配置

        console.log(`Creating ball ${index}:`, {
          tag: tagCount.tag,
          x,
          y,
          radius,
          color: tagInfo.color,
        })

        const ball = Matter.Bodies.circle(x, y, radius, {
          restitution: 0.8, // 弾性（跳ね返り）
          friction: 0.01,
          density: 0.001,
          render: {
            fillStyle: tagInfo.color,
            strokeStyle: "#fff",
            lineWidth: 2,
          },
        })

        // ボールにタグ情報を保存
        const ballWithTag = ball as Matter.Body & { tagInfo: typeof tagInfo; tagCount: number }
        ballWithTag.tagInfo = tagInfo
        ballWithTag.tagCount = tagCount.count

        return ball
      })
      console.log(`Created ${balls.length} balls`)

      // 全てのオブジェクトをワールドに追加
      console.log("Adding bodies to world...")
      Matter.Composite.add(engine.world, [...walls, ...balls])

      // エンジンとレンダラーを開始
      console.log("Starting engine and render...")

      // Runnerを作成して保存
      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)
      // Matter.Render.run(render) // 一時的にコメントアウト
      console.log("Matter.js running (without render)!")

      // テスト: 直接canvasに描画
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        console.log("Drawing test shapes directly to canvas...")

        // 赤い四角
        ctx.fillStyle = "red"
        ctx.fillRect(10, 10, 50, 50)

        // 青い円
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(100, 100, 30, 0, Math.PI * 2)
        ctx.fill()

        // 緑のテキスト
        ctx.fillStyle = "green"
        ctx.font = "20px Arial"
        ctx.fillText("TEST", 150, 50)

        console.log("Drew test shapes: red square, blue circle, green text")
      }

      // マウスコントロール（クリックで弾く）
      const mouse = Matter.Mouse.create(canvasRef.current)
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      })
      Matter.Composite.add(engine.world, mouseConstraint)

      // クリーンアップ
      return () => {
        console.log("Cleaning up Matter.js...")
        Matter.Render.stop(render)
        Matter.Runner.stop(runner)
        Matter.World.clear(engine.world, false)
        Matter.Engine.clear(engine)
        render.canvas.remove()
      }
    } catch (error) {
      console.error("Error initializing Matter.js:", error)
    }
  }, [tagCounts, width, height])

  // テスト: カスタムレンダリングを一時的に無効化
  // useEffect(() => {
  //   if (!canvasRef.current || !engineRef.current || !renderRef.current) return

  //   const canvas = canvasRef.current
  //   const ctx = canvas.getContext("2d")
  //   if (!ctx) return

  //   const engine = engineRef.current
  //   const render = renderRef.current

  //   // Matter.jsのレンダリング後にカスタム描画を追加
  //   const afterRender = () => {
  //     const bodies = Matter.Composite.allBodies(engine.world)

  //     bodies.forEach((body) => {
  //       if ((body as any).tagInfo) {
  //         const tagInfo = (body as any).tagInfo
  //         const tagCount = (body as any).tagCount

  //         // ボールの位置とサイズ
  //         const pos = body.position
  //         const radius = (body as any).circleRadius || 30

  //         // アイコンを描画
  //         ctx.save()
  //         ctx.font = `${radius * 0.8}px Arial`
  //         ctx.textAlign = "center"
  //         ctx.textBaseline = "middle"
  //         ctx.fillText(tagInfo.icon, pos.x, pos.y - radius * 0.15)

  //         // カウント数を描画
  //         ctx.font = `bold ${radius * 0.4}px Arial`
  //         ctx.fillStyle = "#fff"
  //         ctx.fillText(`×${tagCount}`, pos.x, pos.y + radius * 0.4)
  //         ctx.restore()
  //       }
  //     })
  //   }

  //   // Matter.jsのレンダリングイベントにフックする
  //   Matter.Events.on(render, "afterRender", afterRender)

  //   return () => {
  //     Matter.Events.off(render, "afterRender", afterRender)
  //   }
  // }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-4 border-blue-500"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-green-500"
        style={{ display: "block", backgroundColor: "#ffffff" }}
      />
      <div className="absolute top-2 left-2 text-xs bg-black text-white p-1">
        Canvas: {width}x{height}
      </div>
    </div>
  )
}
