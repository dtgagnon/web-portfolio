import { ProjectRepository } from '../lib/database';
import { getDbConnection } from '../lib/database/dbClient';
import fs from 'fs';
import path from 'path';
import { Project } from '../lib/database/models/types';

async function seedProjectsFromJson() {
  try {
    // Read projects from JSON file
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    const projectsJson = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    console.log(`Found ${projectsJson.length} projects in JSON file`);
    
    // First, get all existing projects
    const existingProjects = ProjectRepository.findAll();
    const existingProjectIds = new Set(existingProjects.map(p => p.id));
    const processedIds = new Set<string>();
    
    // Process each project from JSON
    for (const project of projectsJson) {
      try {
        // Prepare content field with extra metadata
        const content = JSON.stringify({
          imageUrl: project.image || project.imageUrl,
          category: project.category,
          technologies: project.technologies,
          skills: project.skills || project.technologies || [], // Include both for backward compatibility
          tags: project.tags || [],
          link: project.link
        });
        
        const now = Math.floor(Date.now() / 1000);
        const db = getDbConnection();
        
        if (existingProjectIds.has(project.id)) {
          // Update existing project
          console.log(`Updating project: ${project.title}`);
          db.prepare(`
            UPDATE projects 
            SET title = ?, description = ?, content = ?, updated_at = ?
            WHERE id = ?
          `).run(
            project.title,
            project.description,
            content,
            now,
            project.id
          );
        } else {
          // Create new project with explicit ID
          console.log(`Creating project: ${project.title}`);
          db.prepare(`
            INSERT INTO projects (id, title, description, content, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            project.id,
            project.title,
            project.description,
            content,
            now,
            now
          );
        }
        
        processedIds.add(project.id);
        db.close();
      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error);
      }
    }
    
    // Delete any projects that weren't in the JSON file
    try {
      const db = getDbConnection();
      const placeholders = Array.from(Array(processedIds.size)).map(() => '?').join(',');
      const idsToKeep = Array.from(processedIds);
      
      if (idsToKeep.length > 0) {
        db.prepare(`
          DELETE FROM projects 
          WHERE id NOT IN (${placeholders})
        `).run(...idsToKeep);
      } else {
        // If no projects in JSON, delete all projects
        db.prepare('DELETE FROM projects').run();
      }
      
      db.close();
    } catch (error) {
      console.error('Error cleaning up old projects:', error);
    }
    
    console.log('Projects seeded successfully');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}

// Run the function
seedProjectsFromJson();
