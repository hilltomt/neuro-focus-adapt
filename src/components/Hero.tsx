import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-bold font-display mb-8">
            For schools that care
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal text-foreground leading-tight mb-6 tracking-tight">
            Every special needs student has the right to{" "}
            <span className="text-primary">support.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed font-body">
            Most never get it.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Neuro brings teachers, students and parents together in one place — so no child falls through the cracks again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 gap-2" asChild>
              <a href="#solution">See how it works <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8" asChild>
              <a href="/auth">Book a demo</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
