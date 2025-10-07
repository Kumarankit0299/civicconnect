export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/notification",
    label: "Notification",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/report-issue",
    label: "Report Issue",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];


export const adminSidebarLinks =[
  {
    route: "/admin",
    label: "Assigned Issue",
  },
  // {
  //   route: "/search",
  //   label: "Search",
  // },
  {
    route: "/admin/issues",
    label: "Issues",
  },
  {
    route: "/admin/pending-issues",
    label: "Pending Issues",
  },
  {
    route: "/admin/resolved-issues",
    label: "Resolved Issues",
  },
  // {
  //   route: "/communities",
  //   label: "Communities",
  // },
];


export const profileTabs = [
  { value: "issues", label: "Issues", icon: "/assets/reply.svg" },
  { value: "pending_issue", label: "Pending Issues", icon: "/assets/members.svg" },
  { value: "resolved_issue", label: "Resolved Issues", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "issues", label: "Issues", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "resolved_issue", label: "Resolved Issues", icon: "/assets/request.svg" },
];
