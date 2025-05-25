import { Project as DbProject } from '@/lib/database/models/types';
import { Project as FrontendProject } from '@/types/project';

/**
 * Transforms a database project into the frontend project format
 */
export function dbToFrontendProject(dbProject: DbProject): FrontendProject {
  let category = 'Uncategorized';
  let technologies: string[] = [];
  let tags: string[] = [];
  let imageUrl = '';
  let link = `/projects/${dbProject.id}`;
  
  // Parse the content field to extract additional metadata
  try {
    if (dbProject.content) {
      const contentData = JSON.parse(dbProject.content);
      
      // Extract image URL
      imageUrl = contentData.imageUrl || '';
      
      // Extract category
      category = contentData.category || category;
      
      // Extract technologies
      technologies = Array.isArray(contentData.technologies) 
        ? contentData.technologies 
        : [];
      
      // Extract tags if available
      tags = Array.isArray(contentData.tags) 
        ? contentData.tags 
        : [];
        
      // Extract custom link if available
      if (contentData.link) {
        link = contentData.link;
      }
    }
  } catch (e) {
    console.error(`Error parsing content for project ${dbProject.id}:`, e);
    // Use content field directly as image if parsing fails
    imageUrl = dbProject.content || '';
  }
  
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description || null,
    imageUrl,
    link,
    category,
    technologies,
    tags
  };
}

/**
 * Transforms a frontend project into a format suitable for database storage
 */
export function frontendToDbProject(frontendProject: Partial<FrontendProject>): Omit<DbProject, 'id' | 'created_at' | 'updated_at'> {
  // Store additional metadata in the content field
  const content = JSON.stringify({
    imageUrl: frontendProject.imageUrl,
    category: frontendProject.category,
    technologies: frontendProject.technologies,
    tags: frontendProject.tags,
    link: frontendProject.link
  });
  
  return {
    title: frontendProject.title || '',
    description: frontendProject.description || null,
    content
  };
}
