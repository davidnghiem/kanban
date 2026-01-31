import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const columnId = searchParams.get('columnId');

    let query = db.select().from(tasks);

    if (columnId) {
      const allTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, parseInt(columnId)))
        .orderBy(tasks.position);
      return NextResponse.json(allTasks);
    }

    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));

    return NextResponse.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, columnId, notes, position } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Default to first column (To Do) if not specified
    const targetColumnId = columnId || 1;

    // Get max position in the column if not specified
    let taskPosition = position;
    if (taskPosition === undefined) {
      const existingTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, targetColumnId));
      taskPosition = existingTasks.length;
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        columnId: targetColumnId,
        notes,
        position: taskPosition,
      })
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
