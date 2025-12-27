import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [isSaving, setIsSaving] = useState(false);

  // Local state for form fields
  const [name, setName] = useState(user?.name || "");
  const [communityPreference, setCommunityPreference] = useState(user?.communityPreference || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [governmentAlerts, setGovernmentAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!user) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Add tRPC mutation to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // TODO: Add tRPC mutation to update notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" disabled>
                      Change Avatar
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">Coming soon</p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ""}
                    disabled
                    className="bg-slate-800/30 border-slate-700 text-slate-500"
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                {/* OAuth Provider (read-only) */}
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Input
                    value={user.oauthProvider === "google" ? "Google Account" : "Manus Account"}
                    disabled
                    className="bg-slate-800/30 border-slate-700 text-slate-500"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Government Decision Alerts</p>
                    <p className="text-sm text-slate-400">
                      Get notified about new government decisions
                    </p>
                  </div>
                  <Switch checked={governmentAlerts} onCheckedChange={setGovernmentAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Property Price Alerts</p>
                    <p className="text-sm text-slate-400">
                      Alerts when prices change in saved cities
                    </p>
                  </div>
                  <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
                </div>

                <Button onClick={handleSaveNotifications} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h2 className="text-xl font-semibold text-white mb-6">Personal Preferences</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="community">Community Preference</Label>
                  <Select value={communityPreference} onValueChange={setCommunityPreference}>
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-700">
                      <SelectValue placeholder="Select your community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Jewish">Jewish</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddhist">Buddhist</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Personalize data based on your community
                  </p>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
