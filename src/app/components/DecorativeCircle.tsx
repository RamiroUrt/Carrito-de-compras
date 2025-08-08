import {DecorativeCircleProps} from '@/types/decorativeCircles'
import  '../global/decorativeCircle.css'

export default function DecorativeCircle({
  color = 'var(--circle-color, #5dcde3)',
  size = 300,
  top = '10%',
  left = '10%',
}: DecorativeCircleProps) {
  return (
    <div
      className="decorative-circle"
      style={{
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        width: size,
        height: size,
        top,
        left,
      }}
    />
  )
}