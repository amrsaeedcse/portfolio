import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <motion.div 
          className="flex flex-col justify-center space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            Hi, I'm Amr
          </h1>
          <h3 className="text-2xl md:text-4xl text-primary font-medium">
            Flutter Developer
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            Computer & Systems Engineering Student at Zagazig University. I bridge the gap between Software Elegance and Hardware Logic.
          </p>
          <div className="pt-4 flex gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
              Contact Me
            </button>
          </div>
        </motion.div>
        <div className="hidden md:flex items-center justify-center relative">
           {/* Space reserved for 3D Model intersection */}
        </div>
      </div>
    </section>
  );
}
