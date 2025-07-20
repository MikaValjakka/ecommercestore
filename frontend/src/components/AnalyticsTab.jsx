import React from "react";
import { motion } from "framer-motion";

function AnalyticsTab() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg h-[calc(100vh-20rem)] text-white">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400 flex justify-center">
        Here we would have some analytics
      </h1>
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-300">
            This is where we would have some analytics
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-300">
              This is where we would have some analytics
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
