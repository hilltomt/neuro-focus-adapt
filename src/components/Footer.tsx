import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">NEURO</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Making education accessible for every mind.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
