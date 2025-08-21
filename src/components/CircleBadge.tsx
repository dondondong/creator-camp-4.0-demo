// CircleBadge：带动画的圆形徽章（支持虚线/实线、hover、选中、高亮、完成状态）

import { motion, type Variants } from "framer-motion";

type CircleBadgeProps = {
  size: number;
  isDone?: boolean;       // 是否已完成
  isSelected?: boolean;   // 是否被选中
  isHovered?: boolean;    // 是否处于 hover 状态

  // --- 未完成(normal)样式 ---
  strokeColor?: string;
  selectedStrokeColor?: string;
  strokeWidth?: number;
  selectedStrokeWidth?: number;
  hoverStrokeColor?: string;
  seletedHoverStrokeColor?: string;
  hoverStrokeWidth?: number;
  selectedHoverStrokeWidth?: number;

  // --- 已完成(done)样式 ---
  doneStrokeColor?: string;
  selectedDoneStrokeColor?: string;
  doneStrokeWidth?: number;
  selectedDoneStrokeWidth?: number;
  doneHoverStrokeColor?: string;
  selectedDoneHoverStrokeColor?: string;
  doneHoverStrokeWidth?: number;
  selectedDoneHoverStrokeWidth?: number;

  // 额外配置
  customVariants?: Variants;
  checkSrc?: string;      // 对勾图标
};

export default function CircleBadge({
  size,
  isDone = false,
  isSelected = false,

  // 未完成
  strokeColor = "rgba(255,255,255,.25)",
  selectedStrokeColor = 'rgba(255,255,255,.92)',
  strokeWidth = 2.5,
  selectedStrokeWidth = 3.5,
  hoverStrokeColor = "rgba(255,255,255,.4)",
  seletedHoverStrokeColor = "rgba(255,255,255,1)",
  hoverStrokeWidth = 2.5,
  selectedHoverStrokeWidth = 3.5,

  // 已完成
  doneStrokeColor = "rgba(255,255,255,.1)",
  selectedDoneStrokeColor = "rgba(255,255,255,1)",
  doneStrokeWidth = 2.5,
  selectedDoneStrokeWidth = 2.5,
  doneHoverStrokeColor = "rgba(255,255,255,.2)",
  selectedDoneHoverStrokeColor = "rgba(255,255,255,1)",
  doneHoverStrokeWidth = 2.5,
  selectedDoneHoverStrokeWidth = 2.5,

  customVariants,
  checkSrc = "/tick_summary.png",
}: CircleBadgeProps) {
  // 半径：用“最大描边宽度”计算，避免 hover 时变粗被裁切
  const maxSW = Math.max(
    strokeWidth,
    hoverStrokeWidth,
    doneStrokeWidth,
    doneHoverStrokeWidth
  );
  const r = (size - maxSW) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // 圆圈动画状态（未完成 = 虚线，已完成 = 实线）
  const circleVariants: Variants = isDone
    ? {
      rest: {
        stroke: isSelected ? selectedDoneStrokeColor : doneStrokeColor,
        strokeWidth: isSelected ? selectedDoneStrokeWidth : doneStrokeWidth,
        fill: "none",
        strokeDasharray: undefined,
      },
      hover: {
        stroke: isSelected ? selectedDoneHoverStrokeColor : doneHoverStrokeColor,
        strokeWidth: isSelected ? selectedDoneHoverStrokeWidth : doneHoverStrokeWidth,
      },
    }
    : {
      rest: {
        stroke: isSelected ? selectedStrokeColor : strokeColor,
        strokeWidth: isSelected ? selectedStrokeWidth : strokeWidth,
        fill: "none",
        strokeDasharray: "4 3.75", // 未完成时虚线样式
      },
      hover: {
        stroke: isSelected ? seletedHoverStrokeColor : hoverStrokeColor,
        strokeWidth: isSelected ? selectedHoverStrokeWidth : hoverStrokeWidth,
      },
    };

  const variantsToUse = customVariants ?? circleVariants;

  // 对勾图标位置（中心对齐）
  const checkSize = size * 0.5;
  const checkX = cx - checkSize / 2;
  const checkY = cy - checkSize / 2;

  return (
    <motion.svg
      width={size}
      height={size}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      {/* 单一圆圈：颜色、粗细、虚线由 variants 控制 */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        variants={variantsToUse}
        transition={{
          strokeWidth: { type: "spring", stiffness: 900, damping: 18 },
          stroke: { duration: 0.12, ease: "easeInOut" },
          fill: { duration: 0.12, ease: "easeInOut" },
        }}
      />

      {/* 已完成时显示对勾 */}
      {isDone && (
        <motion.image
          href={checkSrc}
          x={checkX}
          y={checkY}
          width={checkSize}
          height={checkSize}
          transition={{
            opacity: { duration: 0.12, ease: "easeInOut" },
          }}
        />
      )}
    </motion.svg>
  );
}