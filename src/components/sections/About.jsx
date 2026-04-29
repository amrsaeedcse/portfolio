import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="min-h-screen py-20 flex items-center bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="aspect-square relative rounded-2xl overflow-hidden bg-secondary/50"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg" 
              alt="Amr Abdelazeem" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/20"></div>
          </motion.div>
          <motion.div 
            className="space-y-6 text-lg text-muted-foreground"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
          >
            <p>
              I am a <strong className="text-foreground">Computer Systems Engineer</strong> bridging the gap between Software and Hardware. While I specialize in building high-performance <strong className="text-foreground">Mobile Apps</strong> using Flutter, my engineering background allows me to tackle <strong className="text-foreground">Web Development</strong>, <strong className="text-foreground">Backend Logic</strong>, and <strong className="text-foreground">IoT Systems</strong> with ease.
            </p>
            <p>
              I don't just write code; I design scalable solutions using <strong className="text-foreground">Clean Architecture</strong> and solid engineering principles.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-secondary p-4 rounded-xl text-center">
                <h3 className="font-bold text-foreground">Experience</h3>
                <span className="text-sm">Software & Hardware</span>
              </div>
              <div className="bg-secondary p-4 rounded-xl text-center">
                <h3 className="font-bold text-foreground">Completed</h3>
                <span className="text-sm">10+ Projects</span>
              </div>
              <div className="bg-secondary p-4 rounded-xl text-center">
                <h3 className="font-bold text-foreground">Background</h3>
                <span className="text-sm">Systems Eng.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
