"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/app/_hooks/useTranslation";
import ProjectCard, { Project } from "../_home/_projectsSwiper/ProjectCard";
import { projectImages } from "../_home/_projectsSwiper/mockData";
import { useLocale } from "@/app/_hooks/useLocale";

export function FeaturedProjectsSection() {
  const t = useTranslation("featured");
  const locale = useLocale();

  const projectsData = [
    { title: "Child Educations", category: "Charity & Fundraising" },
    { title: "Healthcare Access", category: "Medical Support" },
    { title: "Clean Water Initiative", category: "Infrastructure" },
    { title: "Women Empowerment", category: "Skills Training" },
    { title: "Food Security Program", category: "Nutrition & Health" },
    { title: "Youth Development", category: "Education & Training" },
  ];

  const projects: Project[] = projectsData.map((proj, index) => ({
    id: index + 1,
    title: proj.title,
    category: proj.category,
    ...projectImages[index],
  }));

  return (
    <section
      id="projects-section"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="c-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6 text-balance">
            {t.title}
          </h2>
        </motion.div>

        <div className="w-full grid grid-cols-4 gap-4">
          {projects.map((project, index) => (
            <ProjectCard project={project} key={`project-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
