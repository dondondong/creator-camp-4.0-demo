// TaskItem：单个任务卡片组件
// - 根据 variant（past / today / future）显示不同状态的任务：
//   • past   已完成：显示 ✓ 图标 + 静态进度数值
//   • today  进行中：显示进度条 + 实时进度数值
//   • future 未开始：只显示占位符 + 进度数值
// - 所有状态都会显示任务图标、标题、奖励信息，以及 Go LIVE 按钮

import ProgressBar from "./ProgressBar";
import styles from "../home.module.css";

type Variant = "past" | "today" | "future";

export default function TaskItem({
    variant,
    task,
}: {
    variant: Variant;
    task: {
        icon: string;          // 任务图标
        title: string;         // 任务标题
        currentProgress: number; //当前进度
        totalProgress: number;  //目标进度
        reward: string;        // 奖励图标
        rewardText: string;    // 奖励说明
    };
}) {
    // 计算进度比值（0~1），避免 totalProgress=0 的异常情况
    const progress = task.totalProgress > 0
        ? task.currentProgress / task.totalProgress
        : 0;

    return (
        <div className={styles.taskItem}>
            <div className={styles.taskItemInner}>
                {/* 左侧：任务图标 */}
                <img src={task.icon} className={styles.taskImg} alt="" />

                {/* 中部：任务标题 + 进度显示 + 奖励 */}
                <div className={styles.taskInfo}>
                    <div className={styles.taskProgressContent}>
                        <div className={styles.taskTitle}>{task.title}</div>

                        <div className={styles.progressContainer}>
                            {variant === "past" && (
                                <>
                                    <img
                                        src="/tick.png"  // 建议放 public/check.svg
                                        alt=""
                                        className={styles.taskCheck}
                                    />
                                    <div className={styles.progressText}>
                                        {`${task.currentProgress}/${task.totalProgress}`}
                                    </div>
                                </>
                            )}

                            {variant === "today" && (
                                <>
                                    <ProgressBar progress={progress} />
                                    <div className={styles.progressText}>
                                        {`${task.currentProgress}/${task.totalProgress}`}
                                    </div>
                                </>
                            )}

                            {variant === "future" && (
                                <div className={styles.futurePlaceholder}>
                                    <div className={styles.progressText}>
                                        {`${task.currentProgress}/${task.totalProgress}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 奖励信息 */}
                    <div className={styles.taskRewardContainer}>
                        <img className={styles.taskRewardImg} src={task.reward} alt="" />
                        <div className={styles.taskRewardText}>{task.rewardText}</div>
                    </div>
                </div>

                {/* 右侧：Go LIVE 按钮 */}
                <div className={styles.goLiveContainer}>
                    <div className={styles.goLiveButton}>
                        <div>Go LIVE</div>
                        <img src="/goliveicon.png" alt="" className={styles.goLiveIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}