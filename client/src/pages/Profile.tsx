import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Settings, MapPin, Bell } from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!user) return null;

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <Link href="/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="p-8 bg-slate-900/50 border-slate-800 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{user.name || "User"}</h2>
                {user.role === "admin" && (
                  <Badge variant="default" className="bg-gradient-to-r from-orange-600 to-red-600">
                    Admin
                  </Badge>
                )}
              </div>

              <p className="text-slate-400 mb-4">{user.email}</p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="border-slate-700 text-slate-300">
                  {user.oauthProvider === "google" ? "🔐 Google Account" : "🔐 Manus Account"}
                </Badge>
                {user.communityPreference && (
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    🕌 {user.communityPreference}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/saved-cities">
            <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-cyan-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Saved Cities</h3>
                  <p className="text-sm text-slate-400">View your favorite cities</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-cyan-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Notifications</h3>
                  <p className="text-sm text-slate-400">Manage your alerts</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Account Info */}
        <Card className="p-6 bg-slate-900/50 border-slate-800 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Member since</span>
              <span className="text-white">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Last sign in</span>
              <span className="text-white">
                {new Date(user.lastSignedIn).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Account ID</span>
              <span className="text-white font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
