// ===== ProgressBar：带动画的进度条 =====

import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import styles from "../home.module.css";

export default function ProgressBar({
    progress = 0.6, // 输入进度比例 (0 ~ 1)
}) {
    const bgRef = useRef<HTMLDivElement | null>(null);
    const widthPx = useMotionValue(0); // 动态存储“已填充宽度(px)”

    // 规范化进度，确保在 0~1 范围
    const p = Math.max(0, Math.min(1, progress));

    // 根据容器宽度重新计算并执行动画
    const play = () => {
        if (!bgRef.current) return;
        const total = bgRef.current.getBoundingClientRect().width; // 背景总宽度
        const target = total * p; // 目标宽度 = 总宽度 × 进度比例

        // 重置到 0，再做 spring 动画到目标值
        widthPx.set(0);
        const controls = animate(widthPx, target, {
            type: "spring",
            stiffness: 200, // 弹性刚度
            damping: 40,    // 阻尼系数（越大越快停止）
        });
        return () => controls.stop();
    };

    // 每次进度变化时重新播放动画
    useEffect(() => {
        const stop = play();
        return () => stop && stop();
    }, [p]);

    return (
        <div ref={bgRef} className={styles.progressBarBg}>
            {/* motion.div 绑定 widthPx，实现平滑动画 */}
            <motion.div
                className={styles.progressBar}
                style={{ width: widthPx }}
            />
        </div>
    );
}