export interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  link: string;
  category: string;
  skills: string[];
  tags: string[];
  // Add other fields like content if they are to be used directly by the card,
  // but for now, focus on what ProjectCard consumes.
}
