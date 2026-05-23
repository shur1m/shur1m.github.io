// @ts-check

/** @typedef {import("./types").ResumeRoleMetadata} ResumeRoleMetadata */
/** @typedef {import("./types").SkillGroupMetadata} SkillGroupMetadata */

/** @type {ResumeRoleMetadata[]} */
export const resumeRoleMetadata = [
  {
    role: "Software Engineer",
    company: "Capital One",
    period: "Jan 2026 - Present",
    description:
      "Development and on-call for enterprise software reliability platform used to perform regional evacuations and automation for disaster recovery.",
  },
  {
    role: "Associate Software Engineer",
    company: "Capital One",
    period: "Aug 2024 - Dec 2025",
    description:
      "Built & designed distributed microservices for bank compliance and enterprise chaos engineering.",
  },
];

/** @type {SkillGroupMetadata[]} */
export const skillGroupMetadata = [
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "DynamoDB", "Redis"],
  },
  {
    title: "Programming Languages",
    items: ["Go", "Python", "Java", "TypeScript", "JavaScript"],
  },
  {
    title: "Technologies",
    items: ["AWS", "Docker", "Kubernetes", "Angular", "React", "OpenTelemetry"],
  },
];
