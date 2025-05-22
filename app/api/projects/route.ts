import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository, TelemetryRepository } from '@/lib/database';
import { Project as FrontendProjectType } from '@/types/project'; // Import frontend Project type
import { Project as BackendProjectType } from '@/lib/database/Repository'; // Assuming this is the backend type

// Helper function to determine imageUrl
const getImageUrl = (content: string | null): string => {
  const defaultImageUrl = 'https://via.placeholder.com/600x400?text=Project+Image';
  if (!content) {
    return defaultImageUrl;
  }

  // Check if content is a direct image URL
  const imageExtensions = /\.(jpeg|jpg|gif|png|svg|webp)$/i;
  if (imageExtensions.test(content) || content.startsWith('data:image')) {
    try {
      // Validate if it's a proper URL
      new URL(content);
      return content;
    } catch (e) {
      // Not a valid URL, proceed to JSON parsing or default
    }
  }

  // Try to parse content as JSON to find imageUrl
  try {
    const parsedContent = JSON.parse(content);
    if (parsedContent && typeof parsedContent.imageUrl === 'string') {
      // Validate if it's a proper URL
      new URL(parsedContent.imageUrl);
      return parsedContent.imageUrl;
    }
  } catch (e) {
    // JSON parsing failed or imageUrl not found/invalid
  }

  return defaultImageUrl;
};

// Helper function to transform backend project to frontend project type
const transformProjectData = (project: BackendProjectType): FrontendProjectType => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: getImageUrl(project.content),
  };
};

// GET /api/projects - Get all projects or a specific project
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('id');
    
    if (projectId) {
      const project = ProjectRepository.findById(projectId);
      
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      const transformedProject = transformProjectData(project);
      return NextResponse.json({
        project: transformedProject,
        success: true
      });
    } else {
      const projects = ProjectRepository.findAll();
      const transformedProjects = projects.map(transformProjectData);
      
      return NextResponse.json({
        projects: transformedProjects,
        success: true
      });
    }
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const { title, description, content } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const project = ProjectRepository.create({
      title,
      description: description || null,
      content: content || null
    });
    
    // Record telemetry for project creation
    TelemetryRepository.recordEvent('project_created', { projectId: project.id });
    
    return NextResponse.json({
      project,
      success: true
    });
  } catch (error) {
    console.error('Project creation API error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT /api/projects - Update a project
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, content } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    const updatedProject = ProjectRepository.update(id, {
      title,
      description,
      content
    });
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Record telemetry for project update
    TelemetryRepository.recordEvent('project_updated', { projectId: id });
    
    return NextResponse.json({
      project: updatedProject,
      success: true
    });
  } catch (error) {
    console.error('Project update API error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    const success = ProjectRepository.delete(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Record telemetry for project deletion
    TelemetryRepository.recordEvent('project_deleted', { projectId: id });
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted'
    });
  } catch (error) {
    console.error('Project deletion API error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
