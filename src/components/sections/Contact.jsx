import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="min-h-screen py-20 bg-background/50 backdrop-blur-sm flex items-center">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.h2>
        <motion.div 
          className="max-w-xl mx-auto bg-card border border-border p-8 rounded-2xl pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
              <input type="text" className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:border-primary transition-colors" placeholder="Insert your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:border-primary transition-colors" placeholder="Insert your email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Project</label>
              <textarea rows="4" className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:border-primary transition-colors" placeholder="Write your project idea"></textarea>
            </div>
            <button className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
