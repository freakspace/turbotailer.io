import { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";

export default function StepWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    });
  });

  return (
    <motion.div animate={controls} initial={{ opacity: 0, x: -100 }}>
      <div className="border border-2 border-solid border-gray-200 rounded-xl p-8 bg-white shadow-xl">
        {children}
      </div>
    </motion.div>
  );
}
