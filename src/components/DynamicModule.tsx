// 日动态模块：教育Tips、回顾、预约

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import styles from "../home.module.css";

interface Props {
    status: "today" | "past" | "future";
    dateId: string;
    text: string;
}

const tipSpring: Transition = {
    type: "spring",
    stiffness: 200,
    damping: 14,
    mass: 1.00,
    velocity: 0.00
};

export default function DynamicModule({ status, dateId, text }: Props) {
    // ===== TODAY：自动轮播文案 =====
    if (status === "today") {
        const tips = [
            "Ask your audiences for LIVE topics through daily polls!",
            "Pin a comment with your LIVE schedule to boost watchtime.",
            "Warm up the chat: greet newcomers by name in the first minute.",
        ];

        const [idx, setIdx] = useState(0);

        useEffect(() => {
            const id = setInterval(() => {
                setIdx((i) => (i + 1) % tips.length);
            }, 3000); // 每 3s 切换一条
            return () => clearInterval(id);
        }, [tips.length]);

        return (
            <div className={styles.dynamicModule}>
                <div className={styles.dynamicModuleContainer}>
                    <div className={styles.dynamicModuleIconContainer}>
                        <img className={styles.liveTipsIcon} src="/live_tips.png" alt="" />
                    </div>

                    <div className={styles.liveTipsContent}>
                        <div className={styles.liveTipsTitle}>LIVE Tips:</div>

                        {/* 轮播区域 */}
                        <div style={{ position: "relative", flex: 1, minHeight: 18, overflow: "hidden" }}>
                            <AnimatePresence>
                                <motion.div
                                    key={idx} // 关键：随 idx 变化触发进出场
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -8, opacity: 0 }}
                                    transition={{ y: tipSpring, opacity: { duration: 0.15 } }}
                                    className={styles.liveTipsText}
                                    aria-live="polite"
                                >
                                    {tips[idx]}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <img className={styles.liveTipsCancelIcon} src="/live_tips_cancel.png" alt="" />
                </div>
            </div>
        );
    }

    // ===== PAST：总结 =====
    if (status === "past") {
        return (
            <div className={styles.dynamicModule}>
                <div className={styles.dynamicModuleContainer}>
                    <img className={styles.dynamicModuleIconContainer} src="/tick_summary.png" alt="" />
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

    // ===== FUTURE：事件引导 =====
    if (status === "future") {
        return (
            <div className={styles.dynamicModule}>
                <div className={styles.dynamicModuleContainer}>
                    <img className={styles.dynamicModuleIconContainer} src="/live_event_not.png" alt="" />
                    <div className={styles.liveEventContent}>
                        <div className={styles.liveEventTitle}>
                            {text} on {dateId}!
                        </div>
                        <div className={styles.liveEventText}>
                            <span>Earn</span>
                            <img style={{ width: 16, height: 16, margin: "0 0 0 4px" }} src="/gem_2.png" alt="" />
                            <span style={{ color: "rgba(255,255,255,.92)", fontSize: 12, marginRight: 6 }}>
                                x10
                            </span>
                            <span>by setting a LIVE Event and go LIVE for 30mins on this date.</span>
                        </div>
                    </div>
                    <div className={styles.iconButtonContainer}>
                        <div>Set LIVE Event</div>
                        <img className={styles.buttonIcon} src="/Chevron_Right_LTR.png" alt="" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}