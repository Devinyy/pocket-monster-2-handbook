import { useState, CSSProperties } from 'react'
import { Image } from 'antd'

// 图片懒加载 + 骨架屏：加载完成前显示 shimmer，完成后淡入。
// 仍用 antd Image 以保留点击放大（配合外层 Image.PreviewGroup）。
export function LazyImage({
  src, alt, imgStyle, minHeight = 140, background, preview = true,
}: {
  src: string
  alt?: string
  imgStyle?: CSSProperties
  minHeight?: number
  background?: string
  preview?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{ position: 'relative', minHeight: loaded ? undefined : minHeight, background }}>
      {!loaded && <div className="img-skeleton" style={{ minHeight }} />}
      <Image
        src={src}
        alt={alt}
        preview={preview}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ ...imgStyle, opacity: loaded ? 1 : 0, transition: 'opacity .35s ease' }}
      />
    </div>
  )
}
