import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const stats = [
  {
    value: "82%",
    description: "of teachers say they don't have enough time to properly support students with extra needs.",
    source: "Skolverket, 2019",
  },
  {
    value: "51%",
    description: "of schools admit that students with NDD diagnoses are NOT getting the support they are legally entitled to.",
    source: "Licensierat Riksförbundet",
  },
  {
    value: "15M SEK",
    description: "the lifetime societal cost of one student who drops out due to lack of support.",
    source: "Skandia Idéer för livet",
  },
];

const HowItWorks = () => {
  return (
    <section id="the-problem" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 text-sm font-bold font-display mb-6">
            <AlertTriangle className="h-4 w-4" />
            The Problem
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            The system is failing our most vulnerable students.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            And it's costing everyone — teachers, families and municipalities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center p-6 rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="text-4xl md:text-5xl font-black font-display text-primary mb-3">{stat.value}</div>
              <p className="text-muted-foreground leading-relaxed mb-3 font-body">{stat.description}</p>
              <p className="text-xs text-muted-foreground/60 italic font-body">{stat.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
