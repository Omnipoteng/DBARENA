const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zsuiihmhyitmmwxxfhwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWlpaG1oeWl0bW13eHhmaHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjQ2NzUsImV4cCI6MjA5NzU0MDY3NX0.O2OR-Ak9I5gPDVVbyPPs6neo90_kY3rUeWue3NmQxZs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- Testing insert with id, title, description, date ---');
  const dummyId = 'test-' + Date.now();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      id: dummyId,
      title: 'Test Title',
      description: 'Test Description',
      date: new Date().toISOString().split('T')[0]
    })
    .select();

  if (error) {
    console.error('Insert error details:', error);
  } else {
    console.log('Insert success! Columns returned:', Object.keys(data[0]));
    // clean up
    await supabase.from('posts').delete().eq('id', dummyId);
  }
}

run();
