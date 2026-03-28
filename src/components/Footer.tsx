import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const businessStats = [
  { value: "500K SEK", description: "the cost to society of just one year of a young person being out of school." },
  { value: "15M SEK", description: "the estimated lifetime cost per individual who drops out due to unmet special needs." },
  { value: "72%", description: "of teachers admit that they do not have the right tools to make it work." },
];

const Footer = () => {
  return (
    <>
      {/* Business Case */}
      <section id="results" className="py-20 md:py-32 bg-secondary/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4 tracking-tight">
              The Business Case
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              This isn't just the right thing to do. It's the smartest investment a municipality can make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {businessStats.map((stat, index) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center p-6 rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-normal font-display text-primary mb-3">{stat.value}</div>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed font-body"
          >
            When students with special needs don't get timely support, they become school refusers. 
            Municipalities then face spiralling costs — specialist schools, home tuition, social services 
            and eventually welfare dependency. Neuro is a preventative intervention that pays for itself many times over.
          </motion.p>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4 tracking-tight">
              Be the first school to use Neuro.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-body">
              We are building Neuro for schools and educators that care. Join the waitlist to get early access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-full px-5"
              />
              <Button size="lg" className="px-8">
                Join waitlist
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-normal text-foreground tracking-tight">Neuro</span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            © 2026 Neuro. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
