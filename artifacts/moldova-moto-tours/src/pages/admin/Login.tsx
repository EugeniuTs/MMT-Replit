import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const mutation = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: { username, password } }, {
      onSuccess: (data) => {
        login(data.token);
        setLocation("/admin");
      },
      onError: () => {
        toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-8 border-b border-border">
          <div className="flex justify-center mb-4">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="font-display text-2xl tracking-wider uppercase text-primary">Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <Input 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="bg-background border-border"
                required
              />
            </div>
            <Button type="submit" className="w-full font-display tracking-wider" disabled={mutation.isPending}>
              {mutation.isPending ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
