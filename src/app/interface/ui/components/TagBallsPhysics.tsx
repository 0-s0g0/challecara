"use client"

import { IDEA_TAGS, type IdeaTag } from "@/app/domain/models/ideaTags"
import Matter from "matter-js"
import { useEffect, useRef, useState } from "react"

interface TagBallsPhysicsProps {
  tagCounts: Array<{ tag: IdeaTag; count: number }>
  width: number
  height: number
}

export function TagBallsPhysics({ tagCounts, width, height }: TagBallsPhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const imagesRef = useRef<Map<IdeaTag, HTMLImageElement>>(new Map())
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // 画像をプリロード
  useEffect(() => {
    if (!tagCounts || tagCounts.length === 0) return

    let loadedCount = 0
    const totalImages = tagCounts.length

    tagCounts.forEach((tagCount) => {
      const tagInfo = IDEA_TAGS[tagCount.tag]
      const img = new Image()
      img.src = tagInfo.imagePath
      img.onload = () => {
        imagesRef.current.set(tagCount.tag, img)
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${tagInfo.imagePath}`)
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
    })
  }, [tagCounts])

  useEffect(() => {
    if (!canvasRef.current || !tagCounts || tagCounts.length === 0 || !imagesLoaded) return

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
      // サイズを投稿数に応じて変更（最小30px、最大60px半径）
      const radius = Math.min(60, Math.max(30, 30 + tagCount.count * 5))

      // ボールの初期位置（上からランダムに配置）
      const x = (width / (tagCounts.length + 1)) * (index + 1) + (Math.random() - 0.5) * 50
      const y = -50 - index * 60 // 上から順番に落ちてくる

      return Bodies.circle(x, y, radius, {
        restitution: 0.6, // 弾性
        friction: 0.001,
        render: {
          fillStyle: "transparent", // カスタムレンダリングで描画
        },
        // カスタムデータを保存
        label: JSON.stringify({
          tag: tagCount.tag,
          count: tagCount.count,
          name: tagInfo.name,
          nameEn: tagInfo.nameEn,
          gradient: tagInfo.gradient,
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
  }, [tagCounts, width, height, imagesLoaded])

  // カスタムレンダリングで背景画像、グラデーション、テキストを描画
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current || !imagesLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const engine = engineRef.current

    const renderFrame = () => {
      // Canvasをクリア
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const bodies = Matter.Composite.allBodies(engine.world)

      bodies.forEach((body) => {
        if (body.isStatic) return

        try {
          const data = JSON.parse(body.label)
          const { tag, name, nameEn, gradient } = data
          const radius = body.circleRadius || 30

          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          // クリッピングパスで円形にする
          ctx.beginPath()
          ctx.arc(0, 0, radius, 0, Math.PI * 2)
          ctx.clip()

          // グラデーション背景を描画
          const gradientMatch = gradient.match(/#[0-9A-Fa-f]{6}/g)
          if (gradientMatch && gradientMatch.length >= 2) {
            const grad = ctx.createLinearGradient(-radius, -radius, radius, radius)
            grad.addColorStop(0, gradientMatch[0])
            grad.addColorStop(1, gradientMatch[1])
            ctx.fillStyle = grad
          } else {
            ctx.fillStyle = gradientMatch?.[0] || "#6366f1"
          }
          ctx.fill()

          // 背景画像を半透明で描画
          const image = imagesRef.current.get(tag)
          if (image) {
            ctx.globalAlpha = 0.2
            const imageSize = radius * 2
            ctx.drawImage(image, -radius, -radius, imageSize, imageSize)
            ctx.globalAlpha = 1.0
          }

          // ボーダーを描画
          ctx.beginPath()
          ctx.arc(0, 0, radius, 0, Math.PI * 2)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.restore()

          // テキストを描画（クリッピングなし）
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          ctx.fillStyle = "#000000"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
          ctx.shadowBlur = 2

          // タグ名（大きく）
          const fontSize = Math.max(12, radius * 0.35)
          ctx.font = `bold ${fontSize}px sans-serif`
          ctx.fillText(name, 0, -fontSize * 0.3)

          // 英語名（小さく）
          const smallFontSize = Math.max(8, radius * 0.22)
          ctx.font = `${smallFontSize}px sans-serif`
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
          ctx.fillText(nameEn, 0, fontSize * 0.5)

          ctx.restore()
        } catch (error) {
          console.error("Rendering error:", error)
        }
      })

      requestAnimationFrame(renderFrame)
    }

    const animationId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [tagCounts, imagesLoaded])

  if (!tagCounts || tagCounts.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <p className="text-sm text-gray-400">まだ投稿がありません</p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden backdrop-blur-xl  rounded-2xl"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
