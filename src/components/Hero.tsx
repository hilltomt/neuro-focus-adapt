import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Soft decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            Designed for ADHD-inclusive teaching
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Adapt content for{" "}
            <span className="text-primary italic">every</span>{" "}
            learner
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            NEURO helps teachers transform educational materials into ADHD-friendly formats — 
            chunked, visual, and engaging. Because every student deserves to focus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 gap-2">
              Start adapting <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              See how it works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
