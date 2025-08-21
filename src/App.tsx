import { useMemo, useState } from "react";
import styles from "./home.module.css";
import {
  AnimatePresence,
  motion,
  type Transition,
} from "framer-motion";

import CircleBadge from "./components/CircleBadge";   // 日历圈
import TaskItem from "./components/TaskItem";         // 单个任务卡片
import ProgressBar from "./components/ProgressBar";   // 进度条
import { daysData, weekTasks } from "./data/daysData";// 业务数据
import DynamicModule from "./components/DynamicModule";// 动态模块

export default function Home() {
  // ===== 数据源 =====
  const dates = daysData;

  // ===== 选中态 =====
  const [selectedId, setSelectedId] = useState<string>(() => {
    const t = dates.find((d) => d.dateLabel === "Today");
    return t ? t.id : (dates[0]?.id as string);
  });

  // ===== 派生状态 =====
  const currentDay = useMemo(
    () => dates.find((d) => d.id === selectedId) ?? dates[0],
    [dates, selectedId]
  );
  const selectedIndex = useMemo(
    () => dates.findIndex((d) => d.id === selectedId),
    [dates, selectedId]
  );

  // ===== 切换方向 =====
  const [direction, setDirection] = useState(0);
  const handleSelect = (nextId: string) => {
    if (nextId === selectedId) return;
    const nextIndex = dates.findIndex((d) => d.id === nextId);
    if (nextIndex !== -1) {
      setDirection(nextIndex > selectedIndex ? +1 : -1);
      setSelectedId(nextId);
    }
  };

  // ===== 内容切换动效 =====
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      width: "100%",
    },
    exit: () => ({
      x: 0,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
  };

  const spring: Transition = {
    type: "spring",
    stiffness: 600,
    damping: 42,
    mass: 0.6,
  };

  return (
    <div className={styles.content}>
      <img className={styles.banner} src="/vt-01.png" alt="" style={{ zIndex: 100 }} />

      <motion.div className={styles.dialogContainer} layoutRoot>
        {/* ===== Header ===== */}
        <div className={styles.headerContainer}>
          <h1>Manage your LIVE and win rewards!</h1>
          <div style={{ display: "flex" }}>
            <img src="/gem_1.png" alt="" style={{ width: 15, marginRight: 4 }} />
            <div className={styles.headerSub}>
              300 gems in total · Get 150 more gems to unlock Flare card x2
            </div>
          </div>
        </div>

        {/* ===== Calendar ===== */}
        <div className={styles.calContainer}>
          {dates.map((d) => {
            const isSelected = d.id === selectedId;

            const dateVariants = {
              rest: { color: isSelected ? "#fff" : "rgba(255,255,255,.5)" },
              hover: { color: isSelected ? "#fff" : "rgba(255,255,255,1)" },
            };

            return (
              <motion.div
                key={d.id}
                className={styles.calItem}
                onClick={() => handleSelect(d.id)}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div variants={dateVariants} className={styles.calDateContainer}>
                  <div
                    className={styles.calDate}
                    style={{ display: d.dateLabel === "" ? "none" : "block" }}
                  >
                    {d.dateLabel}
                  </div>
                  <div
                    className={styles.calWeek}
                    style={{ display: d.dateLabel === "Today" ? "none" : "block" }}
                  >
                    {d.week}
                  </div>
                </motion.div>

                <div className={styles.calBadgeWrap}>
                  <CircleBadge size={32} isDone={d.isDone} isSelected={isSelected} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== 当日内容 ===== */}
        <div style={{ position: "relative", minHeight: 40 }}>
          <div style={{ position: "relative", width: "100%" }}>
            <AnimatePresence custom={direction}>
              <motion.div
                key={`stack-${currentDay.id}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: spring, opacity: { duration: 0.12, ease: "easeInOut" } }}
                layout
              >
                <DynamicModule
                  status={currentDay.status}
                  key={`${currentDay.id}`}
                  dateId={currentDay.id}
                  text={currentDay.eventText}
                />
                <h2>{currentDay.id}</h2>
                <div className={styles.taskGridContainer} style={{ marginBottom: 36 }}>
                  {currentDay.tasks.day.map((task) => (
                    <TaskItem key={task.title} variant={currentDay.status} task={task} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ===== Week ===== */}
        <div className={styles.taskContainer} style={{ marginBottom: 36 }}>
          <h2>This week</h2>
          <div className={styles.taskGridContainer}>
            {weekTasks.map((task) => {
              return (
                <div key={`${task.title}`} className={styles.taskItem}>
                  <div className={styles.taskItemInner}>
                    <img src={task.icon} className={styles.taskImg} alt="" />
                    <div className={styles.taskInfo}>
                      <div className={styles.taskProgressContent}>
                        <div className={styles.taskTitle}>{task.title}</div>
                        <div className={styles.progressContainer}>
                          <ProgressBar progress={task.currentProgress / task.totalProgress} />
                          <div
                            style={{
                              color: "rgba(255,255,255,.5)",
                              fontWeight: 300,
                              fontSize: 13,
                              fontFeatureSettings: `'tnum' on, 'lnum' on`,
                            }}
                          >
                            {`${task.currentProgress}/${task.totalProgress}`}
                          </div>
                        </div>
                      </div>
                      <div className={styles.taskRewardContainer}>
                        <img className={styles.taskRewardImg} src={task.reward} alt="" />
                        <div className={styles.taskRewardText}>{task.rewardText}</div>
                      </div>
                    </div>
                    <div className={styles.goLiveContainer}>
                      <div className={styles.goLiveButton}>
                        <div>Go LIVE</div>
                        <img src="/goliveicon.png" alt="" className={styles.goLiveIcon} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Month ===== */}
        <div className={styles.taskContainer}>
          <h2>This month</h2>
          <img style={{ width: "100%" }} src="/monthcard.png" alt="" />
        </div>

        <img className={styles.banner} src="/banner.png" alt="" />
      </motion.div>
    </div>
  );
}