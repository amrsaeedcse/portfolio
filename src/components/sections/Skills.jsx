import React from 'react';
import { motion } from 'framer-motion';

export default function Skills() {
  const skills = [
    { title: "Mobile Apps", desc: "Flutter, React Native, Dart, Bloc, Clean Arch" },
    { title: "Web & Backend", desc: "React, Node.js, MongoDB, Express, CSS3 & Flexbox" },
    { title: "Hardware & IoT", desc: "RTOS, C/C++, ESP32, VHDL, Sensors" },
    { title: "Tools & Ecosystem", desc: "Git, Linux, Vercel, Postman, Figma" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section id="skills" className="min-h-screen py-20 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Technical Skills
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {skills.map((skill, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-secondary p-6 rounded-2xl hover:bg-secondary/80 transition-colors"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">{skill.title}</h3>
              <p className="text-muted-foreground">{skill.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
