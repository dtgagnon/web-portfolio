import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository, TelemetryRepository } from '@/lib/database';

// GET /api/projects - Get all projects or a specific project
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('id');
    
    if (projectId) {
      const project = ProjectRepository.findById(projectId);
      
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        project,
        success: true
      });
    } else {
      const projects = ProjectRepository.findAll();
      
      return NextResponse.json({
        projects,
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
