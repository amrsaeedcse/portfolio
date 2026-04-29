import React from 'react';
import { motion } from 'framer-motion';

export default function Experience() {
  const experiences = [
    { title: "Mobile App Trainee", org: "DEPI (Digital Pioneers Initiative)", date: "2024", desc: "Intensive training program in partnership with Ministry of CIT." },
    { title: "Mobile App Trainee", org: "ITI", date: "Summer 2024", desc: "Summer training focusing on Flutter fundamentals and Dart." },
    { title: "Computer Engineering Student", org: "Zagazig University", date: "2021 - Present", desc: "Studying Systems, Embedded Software, and CS fundamentals." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section id="experience" className="min-h-screen py-20 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Experience & Education
        </motion.h2>
        <motion.div 
          className="max-w-3xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {experiences.map((exp, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-4 border-l-2 border-primary pl-6 py-2 relative"
            >
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-4"></div>
              <div className="md:w-1/3">
                <div className="text-sm text-primary font-bold">{exp.date}</div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                <div className="text-muted-foreground mb-2">{exp.org}</div>
                <p className="text-sm text-muted-foreground">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
