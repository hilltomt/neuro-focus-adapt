import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">NEURO</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#strategies" className="hover:text-foreground transition-colors">Strategies</a>
          <a href="#adapt" className="hover:text-foreground transition-colors">Try it</a>
        </div>
        <Button size="sm" asChild><a href="/auth">Get Started</a></Button>
      </div>
    </nav>
  );
};

export default Navbar;
