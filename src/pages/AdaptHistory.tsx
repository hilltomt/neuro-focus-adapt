import { useEffect, useState } from "react";
import { Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Adaptation {
  id: string;
  title: string | null;
  original_content: string;
  adapted_content: string;
  strategies_used: string[] | null;
  created_at: string;
}

const AdaptHistory = () => {
  const { user } = useAuth();
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("adaptations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setAdaptations(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("adaptations").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    setAdaptations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Adaptation History
        </h1>
        <p className="text-muted-foreground mb-8">
          Your previously adapted content.
        </p>

        {loading ? (
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        ) : adaptations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No adaptations yet. Go to Adapt Content to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {adaptations.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <button
                      className="flex-1 text-left"
                      onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    >
                      <p className="font-medium text-foreground text-sm">
                        {a.title || "Untitled"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(a.created_at), "MMM d, yyyy 'at' h:mm a")}
                        {a.strategies_used && (
                          <span className="ml-2">
                            • {a.strategies_used.length} strategies
                          </span>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                      >
                        {expandedId === a.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedId === a.id && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Original</p>
                        <div className="text-sm bg-muted/30 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {a.original_content}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Adapted</p>
                        <div className="text-sm bg-primary/5 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {a.adapted_content}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdaptHistory;
