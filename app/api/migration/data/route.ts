import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'final-migration-data-backup.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    const migrationData = JSON.parse(data);

    return NextResponse.json(migrationData);
  } catch (error) {
    console.error('Error loading migration data:', error);
    return NextResponse.json(
      { error: 'Failed to load migration data' },
      { status: 500 }
    );
  }
}
