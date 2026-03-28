import { motion } from "framer-motion";
import { Upload, Wand2, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Paste your content",
    description: "Drop in any lesson plan, worksheet, or reading material you need to adapt.",
  },
  {
    icon: Wand2,
    title: "Choose adaptations",
    description: "Select ADHD-friendly strategies: chunking, visual cues, simplified language, and more.",
  },
  {
    icon: CheckCircle,
    title: "Get adapted material",
    description: "Receive ready-to-use content formatted to reduce cognitive load and boost engagement.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three steps to inclusive content
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No special training required. Just paste, adapt, and teach.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-sm font-semibold text-accent mb-2">Step {index + 1}</div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
