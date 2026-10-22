"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Слово в заголовке сменяется по кругу; для скринридеров — полный список сразу.
export function WordRotator({ words, interval = 2400 }: { words: readonly string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  // Общая кнопка паузы в hero останавливает и сферу, и смену слов
  useEffect(() => {
    const onPause = (e: Event) => setPaused((e as CustomEvent<boolean>).detail);
    window.addEventListener("hero-pause", onPause);
    return () => window.removeEventListener("hero-pause", onPause);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, paused, words.length, interval]);

  return (
    <span className="relative inline-grid align-bottom">
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden="true"
          className="text-gradient col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
