import { NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await callreadyQuizDb
      .from('verified_leads')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }
    
    console.log('✅ Database connection successful');
    
    // Test table structure
    const { data: structure, error: structureError } = await callreadyQuizDb
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'verified_leads');
    
    if (structureError) {
      console.log('⚠️ Could not get table structure:', structureError.message);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful',
      sampleData: data,
      tableStructure: structure,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}



