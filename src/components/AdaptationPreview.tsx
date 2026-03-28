import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const AdaptationPreview = () => {
  return (
    <section id="adapt" className="py-20 md:py-32">
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
            A side-by-side look at how NEURO transforms content.
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
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Original Content
            </div>
            <div className="text-sm text-foreground leading-relaxed space-y-3">
              <p>
                Read Chapter 5 about the water cycle, including evaporation, condensation, and precipitation. 
                Then answer the comprehension questions on pages 47-49. Make sure to include examples from 
                the text in your answers and write at least three complete sentences for each question. 
                Submit your work by Friday.
              </p>
            </div>
          </Card>

          {/* Arrow for desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          </div>

          {/* After */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" /> NEURO Adapted
            </div>
            <div className="text-sm text-foreground leading-relaxed space-y-3">
              <div className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">1</span>
                <p>📖 Read <strong>Chapter 5: The Water Cycle</strong> <span className="text-muted-foreground">(~15 min)</span></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">2</span>
                <p>🔍 Focus on 3 key terms: <strong>evaporation</strong>, <strong>condensation</strong>, <strong>precipitation</strong></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">3</span>
                <p>✍️ Answer questions on p. 47-49 <span className="text-muted-foreground">(3 sentences each, use text examples)</span></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-accent/20 text-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">!</span>
                <p>📅 <strong>Due: Friday</strong></p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AdaptationPreview;
