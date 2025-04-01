import { NextRequest, NextResponse } from 'next/server';
import { UserRepository, SessionRepository, TelemetryRepository } from '@/lib/database';

// POST /api/users - Create or update a user
export async function POST(request: NextRequest) {
  try {
    const { email, name, sessionId } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Check if user exists
    let user = UserRepository.findByEmail(email);
    
    if (user) {
      // Update existing user
      user = UserRepository.update(user.id, { name });
      TelemetryRepository.recordEvent('user_updated', { userId: user?.id }, user?.id, sessionId);
    } else {
      // Create new user
      user = UserRepository.create(email, name);
      TelemetryRepository.recordEvent('user_created', { userId: user?.id }, user?.id, sessionId);
    }
    
    // Associate session with user if provided
    if (sessionId && user) {
      SessionRepository.setUserId(sessionId, user.id);
    }
    
    return NextResponse.json({
      user,
      success: true
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
  }
}

// GET /api/users - Get user information
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const id = request.nextUrl.searchParams.get('id');
    
    if (!email && !id) {
      return NextResponse.json({ error: 'Email or ID is required' }, { status: 400 });
    }
    
    let user;
    if (email) {
      user = UserRepository.findByEmail(email);
    } else if (id) {
      user = UserRepository.findById(id);
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      user,
      success: true
    });
  } catch (error) {
    console.error('User lookup API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user information' }, { status: 500 });
  }
}
