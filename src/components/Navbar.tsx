import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">Neuro</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#the-problem" className="hover:text-foreground transition-colors">The Problem</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#solution" className="hover:text-foreground transition-colors">Solution</a>
          <a href="#results" className="hover:text-foreground transition-colors">Results</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="/auth">Request a demo</a>
          </Button>
          <Button size="sm" asChild>
            <a href="#waitlist">Join waitlist</a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
