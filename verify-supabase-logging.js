#!/usr/bin/env node
/**
 * Verify Supabase Logging for Smoke Test
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jqjftrlnyysqcwbbigpw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtqek6ckuwjAo';

async function verifyLogging() {
  const sessionId = process.argv[2] || 'test-smoke-1769962668202';
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 Verifying Supabase Logging');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Session ID: ${sessionId}\n`);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Check leads table
  console.log('📊 Checking leads table...');
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (leadsError) {
    console.error('❌ Error querying leads:', leadsError.message);
  } else if (leads && leads.length > 0) {
    console.log(`✅ Found ${leads.length} lead(s):\n`);
    leads.forEach(lead => {
      console.log(`   Lead ID: ${lead.id}`);
      console.log(`   Contact ID: ${lead.contact_id}`);
      console.log(`   Funnel: ${lead.funnel_type}`);
      console.log(`   Status: ${lead.status}`);
      console.log(`   Verified: ${lead.is_verified ? 'YES' : 'NO'}`);
      console.log(`   Created: ${lead.created_at}\n`);
    });
  } else {
    console.log('⚠️  No leads found\n');
  }
  
  // Check analytics_events table
  console.log('📊 Checking analytics_events table...');
  const { data: events, error: eventsError } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (eventsError) {
    console.error('❌ Error querying events:', eventsError.message);
  } else if (events && events.length > 0) {
    console.log(`✅ Found ${events.length} event(s):\n`);
    events.forEach(event => {
      console.log(`   Event: ${event.event_name}`);
      console.log(`   Category: ${event.event_category}`);
      console.log(`   Label: ${event.event_label}`);
      if (event.event_name === 'webhook_delivery') {
        const props = event.properties || {};
        console.log(`   GHL Success: ${props.ghl_success}`);
        console.log(`   Zapier Success: ${props.zapier_success}`);
        console.log(`   Lead ID: ${props.lead_id}`);
      }
      console.log(`   Created: ${event.created_at}\n`);
    });
  } else {
    console.log('⚠️  No events found\n');
  }
  
  // Check contacts table
  if (leads && leads.length > 0) {
    const contactId = leads[0].contact_id;
    console.log(`📊 Checking contact ${contactId}...`);
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (contactError) {
      console.error('❌ Error querying contact:', contactError.message);
    } else if (contact) {
      console.log(`✅ Contact found:\n`);
      console.log(`   Email: ${contact.email}`);
      console.log(`   Name: ${contact.first_name} ${contact.last_name}`);
      console.log(`   Phone: ${contact.phone || 'N/A'}`);
      console.log(`   Created: ${contact.created_at}\n`);
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Verification Complete');
  console.log('═══════════════════════════════════════════════════════════\n');
}

verifyLogging().catch(console.error);
