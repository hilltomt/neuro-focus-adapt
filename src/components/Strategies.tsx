import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Heart, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features: { icon: LucideIcon; title: string; subtitle: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "For Teachers",
    subtitle: "Smart scheduling & student overviews.",
    description: "See every student's level, needs, and achievements at a glance. Spend less time on admin and more time actually teaching.",
  },
  {
    icon: BookOpen,
    title: "For Students",
    subtitle: "A calm, structured school day.",
    description: "Materials, schedules, and feedback — all in one place. No overwhelm. No confusion. Just clarity.",
  },
  {
    icon: Heart,
    title: "For Parents",
    subtitle: "Stay close, without chasing anyone.",
    description: "See what your child is working on, what they've achieved, and communicate directly with teachers — all without a single phone call.",
  },
];

const Strategies = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4 tracking-tight">
            One platform. For every person who cares about the child.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card rounded-xl">
                <CardContent className="p-6">
                  <feature.icon className="h-7 w-7 text-primary mb-3" strokeWidth={1.5} />
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-primary font-bold text-sm mb-2 font-display">{feature.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body">{feature.description}</p>
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
