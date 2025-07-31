import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to determine meeting status based on start time and duration
export function getMeetingStatus(interview: {
  startTime: number;
  duration?: number;
  status?: string;
}): "upcoming" | "live" | "completed" {
  // If the interview has a status field and it's "completed", return completed
  if (interview.status === "completed") {
    return "completed";
  }

  const now = Date.now();
  const startTime = interview.startTime;
  const duration = interview.duration || 60 * 60 * 1000; // Default 1 hour if not specified
  const endTime = startTime + duration;

  if (now < startTime) {
    return "upcoming";
  } else if (now >= startTime && now <= endTime) {
    return "live";
  } else {
    return "completed";
  }
}

// Function to calculate recording duration
export function calculateRecordingDuration(startTime: number, endTime: number): string {
  const durationMs = endTime - startTime;
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface User {
  clerkId: string;
  name: string;
  email: string;
  image?: string;
}

interface UserInfo {
  name: string;
  email: string;
  image: string;
  initials: string;
}

// Function to get interviewer information
export function getInterviewerInfo(users: User[], interviewerId: string): UserInfo {
  const interviewer = users?.find(user => user.clerkId === interviewerId);
  if (!interviewer) {
    return {
      name: "Unknown Interviewer",
      email: "",
      image: "",
      initials: "UI"
    };
  }
  
  const nameParts = interviewer.name.split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : nameParts[0][0]?.toUpperCase() || "UI";
    
  return {
    name: interviewer.name,
    email: interviewer.email,
    image: interviewer.image || "",
    initials
  };
}

// Function to get candidate information
export function getCandidateInfo(users: User[], candidateId: string): UserInfo {
  const candidate = users?.find(user => user.clerkId === candidateId);
  if (!candidate) {
    return {
      name: "Unknown Candidate",
      email: "",
      image: "",
      initials: "UC"
    };
  }
  
  const nameParts = candidate.name.split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : nameParts[0][0]?.toUpperCase() || "UC";
    
  return {
    name: candidate.name,
    email: candidate.email,
    image: candidate.image || "",
    initials
  };
}

interface Interview {
  startTime: number;
  status?: string;
}

interface InterviewGroups {
  today: Interview[];
  tomorrow: Interview[];
  upcoming: Interview[];
  past: Interview[];
  completed: Interview[];
  succeeded: Interview[];
  failed: Interview[];
}

// Function to group interviews
export function groupInterviews(interviews: Interview[]): InterviewGroups {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const groups: InterviewGroups = {
    today: [],
    tomorrow: [],
    upcoming: [],
    past: [],
    completed: [],
    succeeded: [],
    failed: []
  };

  interviews.forEach(interview => {
    const interviewDate = new Date(interview.startTime);
    const status = getMeetingStatus({
      startTime: interview.startTime,
      status: interview.status,
    });

    if (status === "completed") {
      groups.past.push(interview);
      groups.completed.push(interview);
    } else if (interviewDate.toDateString() === today.toDateString()) {
      groups.today.push(interview);
    } else if (interviewDate.toDateString() === tomorrow.toDateString()) {
      groups.tomorrow.push(interview);
    } else {
      groups.upcoming.push(interview);
    }
  });

  return groups;
}
