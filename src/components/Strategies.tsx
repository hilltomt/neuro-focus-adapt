import { motion } from "framer-motion";
import { Layers, Eye, Clock, MessageSquare, Palette, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const strategies = [
  {
    icon: Layers,
    title: "Content Chunking",
    description: "Break long texts into manageable, bite-sized sections with clear headings.",
  },
  {
    icon: Eye,
    title: "Visual Cues",
    description: "Add icons, color coding, and highlights to guide attention to key information.",
  },
  {
    icon: Clock,
    title: "Time Estimates",
    description: "Add time indicators so students can plan and manage their focus windows.",
  },
  {
    icon: MessageSquare,
    title: "Simplified Language",
    description: "Rephrase complex instructions into clear, direct, and concise language.",
  },
  {
    icon: Palette,
    title: "Multi-Sensory Format",
    description: "Transform text-heavy content into mixed formats with visuals and interactions.",
  },
  {
    icon: ListChecks,
    title: "Task Breakdown",
    description: "Convert large assignments into numbered step-by-step checklists.",
  },
];

const Strategies = () => {
  return (
    <section id="strategies" className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            ADHD-friendly strategies
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Evidence-based techniques built right into the adaptation engine.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card">
                <CardContent className="p-6">
                  <strategy.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{strategy.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{strategy.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Strategies;
