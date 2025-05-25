import { ProjectRepository } from '../lib/database';
import { getDbConnection } from '../lib/database/dbClient';
import fs from 'fs';
import path from 'path';

async function seedProjectsFromJson() {
  try {
    // Read projects from JSON file
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    const projectsJson = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    console.log(`Found ${projectsJson.length} projects in JSON file`);
    
    // Process each project
    for (const project of projectsJson) {
      // Prepare content field with extra metadata
      const content = JSON.stringify({
        imageUrl: project.image || project.imageUrl,
        category: project.category,
        technologies: project.technologies,
        tags: project.tags || [],
        link: project.link
      });
      
      // Check if project exists
      const existingProject = ProjectRepository.findById(project.id);
      
      if (existingProject) {
        // Update existing project
        console.log(`Updating project: ${project.title}`);
        ProjectRepository.update(project.id, {
          title: project.title,
          description: project.description,
          content
        });
      } else {
        // Create new project with explicit ID
        console.log(`Creating project: ${project.title}`);
        const db = getDbConnection();
        const now = Math.floor(Date.now() / 1000);
        
        db.prepare(`
          INSERT INTO projects (id, title, description, content, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(project.id, project.title, project.description, content, now, now);
        
        db.close();
      }
    }
    
    console.log('Projects seeded successfully');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}

// Run the function
seedProjectsFromJson();
