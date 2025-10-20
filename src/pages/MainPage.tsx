import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faSlidersH,
  faShareAlt,
  faGuitar,
  faCloudArrowUp,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";

const features = [
  { title: "Fast Transcription", desc: "AI converts your audio to TABs instantly.", icon: faBolt },
  { title: "Adjust Difficulty", desc: "Choose Beginner, Intermediate, or Advanced level.", icon: faSlidersH },
  { title: "Save & Share", desc: "Easily save, download, and share your TABs.", icon: faShareAlt },
  { title: "Multi-Instrument", desc: "Supports both electric and acoustic guitars.", icon: faGuitar },
  { title: "Fast Upload", desc: "Drag & drop or record audio directly in browser.", icon: faCloudArrowUp },
  { title: "Professional Quality", desc: "Export high-quality TABs compatible with top tools.", icon: faMusic },
];

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-blue-500/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-purple-600/20 rounded-full blur-[180px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center h-screen text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          AI Guitar Studio.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mt-6"
        >
          Upload your music. Let AI transcribe your guitar TABs — fast, accurate, and beautiful.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-blue-600/40">
            Upload Audio
          </Button>
          <Button className="px-4 py-2 bg-transparent border border-white-500 hover:border-blue-400 text-gray-300 hover:text-white rounded-full text-lg font-semibold transition-all">
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          What We Offer
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-2xl shadow-lg text-center backdrop-blur-lg transition-all hover:scale-105"
            >
              <FontAwesomeIcon
                icon={feature.icon}
                size="2x"
                className="text-blue-400 mb-4 drop-shadow-md"
              />
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
          {[
            { num: "01", title: "Upload Audio", desc: "Drop your file or record directly in your browser." },
            { num: "02", title: "Set Preferences", desc: "Select difficulty, instrument, and custom settings." },
            { num: "03", title: "Get TABs", desc: "AI instantly generates accurate, ready-to-play tablature." },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-gray-300"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-500/30">
                {step.num}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
              <p className="max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MainPage;
