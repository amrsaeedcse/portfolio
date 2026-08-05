import React from 'react';
import { motion } from 'framer-motion';

export default function Projects() {
  const projects = [
    { title: "Loadr Media Engine", subtitle: "Flutter, Python & Native FFmpeg", type: "app", image: "assets/loadr/loadr.png" },
    { title: "Batrina Full-Stack", subtitle: "Flutter, Node.js & MongoDB", type: "app", image: "assets/batrina/hero.webp" },
    { title: "Portfolio", subtitle: "React, GSAP & Canvas 2D Engine", type: "web", image: "assets/portfolio/cover.png" },
    { title: "MIPS-32 CPU", subtitle: "VHDL, FPGA & Quartus Prime", type: "iot", image: "assets/mips-32/MIPS32_Block.png" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section id="projects" className="min-h-screen py-20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured Projects
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-card rounded-2xl overflow-hidden border border-border"
            >
              <div className="aspect-video bg-secondary/50 relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">{project.title}</h3>
                <span className="text-primary mb-4 block">{project.subtitle}</span>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors pointer-events-auto">
                    Code
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors pointer-events-auto">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
