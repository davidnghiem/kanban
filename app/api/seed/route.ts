import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { columns } from '@/lib/schema';

export const dynamic = 'force-dynamic';

// POST /api/seed - Seed default columns
export async function POST() {
  try {
    // Check if columns already exist
    const existingColumns = await db.select().from(columns);

    if (existingColumns.length > 0) {
      return NextResponse.json({
        message: 'Columns already exist',
        columns: existingColumns
      });
    }

    // Create default columns
    const defaultColumns = [
      { name: 'To Do', position: 0 },
      { name: 'In Progress', position: 1 },
      { name: 'Done', position: 2 },
    ];

    const createdColumns = await db
      .insert(columns)
      .values(defaultColumns)
      .returning();

    return NextResponse.json({
      message: 'Default columns created',
      columns: createdColumns
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
