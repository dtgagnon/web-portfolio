// scripts/export-projects.ts
import { ProjectRepository } from '@/lib/database';
import { Project as DbProject } from '@/lib/database/models/types';
import fs from 'fs';
import path from 'path';

// Define the transformer function inline to avoid path alias issues
function dbToFrontendProject(dbProject: DbProject): any {
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
    description: dbProject.description || '',
    imageUrl,
    link,
    category,
    technologies,
    tags,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at
  };
}

async function exportProjectsToJson() {
  try {
    // Get all projects from database
    const dbProjects = ProjectRepository.findAll();
    
    // Transform to frontend format
    const frontendProjects = dbProjects.map(dbToFrontendProject);
    
    // Write to JSON file
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    fs.writeFileSync(
      projectsPath, 
      JSON.stringify(frontendProjects, null, 2)
    );
    
    console.log(`${frontendProjects.length} projects exported to ${projectsPath}`);
  } catch (error) {
    console.error('Error exporting projects:', error);
  }
}

exportProjectsToJson();