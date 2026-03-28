import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

const comparisons = [
  { before: "Teachers buried in paperwork.", after: "Teachers plan efficiently with structured overviews of every student's needs." },
  { before: "Students sit unsupported in class.", after: "Students have a clear, calm view of their schedule and materials." },
  { before: "Parents wait weeks for updates.", after: "Parents see progress in real time." },
  { before: "Communication scattered across emails, calls and texts.", after: "Everyone communicates in one place." },
  { before: "No clear picture of progress.", after: "Data-driven insights on every student's journey." },
];

const AdaptationPreview = () => {
  return (
    <section id="solution" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            See the difference
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From overwhelm to clarity — for everyone involved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch"
        >
          {/* Before */}
          <Card className="p-6 bg-card border-border/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">
              Before Neuro
            </div>
            <div className="space-y-4">
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{item.before}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* After */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-5">
              With Neuro
            </div>
            <div className="space-y-4">
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{item.after}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AdaptationPreview;
