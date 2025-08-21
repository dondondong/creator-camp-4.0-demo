// 日动态模块（顶部的可变卡片）：
// - today  ：显示“运营建议 Tips”，并在卡片内部做轻量轮播切换文案
// - past   ：显示昨日/历史总结
// - future ：显示预约引导文案
//
// 该组件是纯展示 + 轻交互（定时切换文案）；不持久化状态，不依赖外部副作用。

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import styles from "../home.module.css";

interface Props {
  status: "today" | "past" | "future"; // 由页面根据所选日期计算好传入
  dateId: string;                       // 当前日期的标识（用于 past/future 文案展示）
  text: string;                         // future 卡片里的标题部分（如事件名）
}

// 单条 Tip 的出入场动效（轻微上下位移 + 淡入/淡出）
const tipSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 14,
  mass: 1,
  velocity: 0,
};

export default function DynamicModule({ status, dateId, text }: Props) {
  // ---------- TODAY：运营建议（自动轮播 3 条文案） ----------
  if (status === "today") {
    // 轮播内容池（可与数据层对接；目前写死 3 条）
    const tips = [
      "Ask your audiences for LIVE topics through daily polls!",
      "Pin a comment with your LIVE schedule to boost watchtime.",
      "Warm up the chat: greet newcomers by name in the first minute.",
    ];

    // 当前展示的 Tip 索引
    const [idx, setIdx] = useState(0);

    // 每 3s 切换到下一条 Tip；组件卸载或依赖变更时清除定时器
    useEffect(() => {
      const id = setInterval(() => {
        setIdx((i) => (i + 1) % tips.length); // 0→1→2→0 循环
      }, 3000);
      return () => clearInterval(id);
    }, [tips.length]); // 依赖长度而非数组本身，避免数组引用变化导致反复重置

    return (
      <div className={styles.dynamicModule}>
        <div className={styles.dynamicModuleContainer}>
          {/* 左侧图标 */}
          <div className={styles.dynamicModuleIconContainer}>
            <img className={styles.liveTipsIcon} src="/live_tips.png" alt="" />
          </div>

          {/* 右侧内容（标题 + 轮播区域） */}
          <div className={styles.liveTipsContent}>
            <div className={styles.liveTipsTitle}>LIVE Tips:</div>

            {/* 轮播区域：只渲染一条，随 idx 变化做淡入/淡出与轻微位移动画 */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: 18, // 保证容器最小高度，避免切换时版式抖动
                overflow: "hidden",
              }}
            >
              <AnimatePresence>
                <motion.div
                  key={idx} // 关键：每次 idx 改变都被视作“新元素”，触发出入场
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ y: tipSpring, opacity: { duration: 0.15 } }}
                  className={styles.liveTipsText}
                  aria-live="polite" // 无障碍：让读屏在变更时温和播报
                >
                  {tips[idx]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 关闭按钮（目前为装饰，不绑定事件） */}
          <img
            className={styles.liveTipsCancelIcon}
            src="/live_tips_cancel.png"
            alt=""
          />
        </div>
      </div>
    );
  }

  // ---------- PAST：历史总结 ----------
  if (status === "past") {
    return (
      <div className={styles.dynamicModule}>
        <div className={styles.dynamicModuleContainer}>
          <img
            className={styles.dynamicModuleIconContainer}
            src="/tick_summary.png"
            alt=""
          />
          <div className={styles.summaryContent}>
            <div className={styles.summaryTitle}>
              Well done! All daily challenges completed on {dateId}!
            </div>
            <div className={styles.summaryText}>
              Go LIVE for
              <span className={styles.summaryTextHighlight}>120</span> mins · Recieved
              <span className={styles.summaryTextHighlight}>15</span> comments · Completed
              <span className={styles.summaryTextHighlight}>2</span> challenges
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- FUTURE：预约引导 ----------
  if (status === "future") {
    return (
      <div className={styles.dynamicModule}>
        <div className={styles.dynamicModuleContainer}>
          <img
            className={styles.dynamicModuleIconContainer}
            src="/live_event_not.png"
            alt=""
          />
          <div className={styles.liveEventContent}>
            <div className={styles.liveEventTitle}>
              {text} on {dateId}!
            </div>
            <div className={styles.liveEventText}>
              <span>Earn</span>
              <img
                style={{ width: 16, height: 16, margin: "0 0 0 4px" }}
                src="/gem_2.png"
                alt=""
              />
              <span
                style={{
                  color: "rgba(255,255,255,.92)",
                  fontSize: 12,
                  marginRight: 6,
                }}
              >
                x10
              </span>
              <span>
                by setting a LIVE Event and go LIVE for 30mins on this date.
              </span>
            </div>
          </div>

          {/* 右侧引导按钮（仅展示） */}
          <div className={styles.iconButtonContainer}>
            <div>Set LIVE Event</div>
            <img className={styles.buttonIcon} src="/Chevron_Right_LTR.png" alt="" />
          </div>
        </div>
      </div>
    );
  }

  // 非预期状态：不渲染
  return null;
}