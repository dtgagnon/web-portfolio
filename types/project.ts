export interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  // Add other fields like content if they are to be used directly by the card,
  // but for now, focus on what ProjectCard consumes.
}
