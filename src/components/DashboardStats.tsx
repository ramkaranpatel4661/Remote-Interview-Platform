"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  UsersIcon, 
  XCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from "lucide-react";
import { groupInterviews } from "@/lib/utils";

function DashboardStats() {
  const interviews = useQuery(api.interviews.getAllInterviews);
  const users = useQuery(api.users.getUsers);

  if (!interviews || !users) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const groupedInterviews = groupInterviews(interviews);
  const totalInterviews = interviews.length;
  const completedInterviews = groupedInterviews.completed.length;
  const succeededInterviews = groupedInterviews.succeeded.length;
  const failedInterviews = groupedInterviews.failed.length;
  const upcomingInterviews = groupedInterviews.upcoming.length;
  const successRate = completedInterviews > 0 ? Math.round((succeededInterviews / completedInterviews) * 100) : 0;

  const candidates = users.filter(u => u.role === "candidate");
  const interviewers = users.filter(u => u.role === "interviewer");

  return (
    <div className="space-y-6">
      {/* MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingInterviews} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {succeededInterviews} passed, {failedInterviews} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-muted-foreground">
              Active candidates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviewers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewers.length}</div>
            <p className="text-xs text-muted-foreground">
              Available interviewers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DETAILED STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Upcoming</span>
              </div>
              <Badge variant="outline">{upcomingInterviews}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm">Passed</span>
              </div>
              <Badge variant="default">{succeededInterviews}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm">Failed</span>
              </div>
              <Badge variant="destructive">{failedInterviews}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {interviews.slice(0, 3).map((interview) => (
                <div key={interview._id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{interview.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {interview.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Schedule new interview
            </div>
            <div className="text-sm text-muted-foreground">
              • Review completed interviews
            </div>
            <div className="text-sm text-muted-foreground">
              • Manage user roles
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardStats; 