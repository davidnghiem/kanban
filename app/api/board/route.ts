import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { columns, tasks } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/board - Get full board state (columns with tasks)
export async function GET() {
  try {
    // Get all columns
    const allColumns = await db
      .select()
      .from(columns)
      .orderBy(asc(columns.position));

    // Get all tasks
    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(asc(tasks.position));

    // Group tasks by column
    const board = allColumns.map((column) => ({
      ...column,
      tasks: allTasks.filter((task) => task.columnId === column.id),
    }));

    return NextResponse.json({
      columns: board,
      totalTasks: allTasks.length,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 });
  }
}
