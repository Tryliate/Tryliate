import { createClient } from '@supabase/supabase-js';
import { BYOI_SCHEMA_SQL } from '../infrastructure/schema';
import crypto from 'crypto';

/**
 * Trymate: The Neural Infrastructure Architect
 * Handles autonomous provisioning and synchronization of user infrastructure.
 */
export class Trymate {

  static async provisionProject(accessToken: string) {
    console.log('🤖 [Trymate] Scanning infrastructure...');

    // 1. List Projects
    const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!projectsResponse.ok) throw new Error('Failed to list projects');
    const projects = await projectsResponse.json();

    // 2. Find Target
    let targetProject = projects.find((p: any) => p.name === 'Tryliate Studio');
    if (targetProject) {
      console.log('🤖 [Trymate] Found existing studio:', targetProject.id);
      return {
        project: targetProject,
        isNew: false,
        dbPass: null // We don't know the password for existing projects
      };
    }

    // 3. Provision New if Missing
    console.log('🤖 [Trymate] No studio found. Analyzing quotas...');
    const orgsResponse = await fetch('https://api.supabase.com/v1/organizations', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const organizations = await orgsResponse.json();

    if (!organizations?.length) throw new Error('No organizations found');

    const primaryOrg = organizations[0];
    const orgProjects = projects.filter((p: any) => p.organization_id === primaryOrg.id);

    if (orgProjects.length >= 2) {
      // Return null password since we can't control existing project credentials
      return {
        project: orgProjects[0],
        isNew: false,
        dbPass: null
      };
    }

    console.log(`🤖 [Trymate] Provisioning 'Tryliate Studio' in ${primaryOrg.name}...`);
    // Generate secure random password for the user's new database
    const dbPass = crypto.randomBytes(16).toString('hex') + 'A1!';

    const createResponse = await fetch('https://api.supabase.com/v1/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Tryliate Studio',
        organization_id: primaryOrg.id,
        region: 'us-east-1',
        plan: 'free',
        db_pass: dbPass
      })
    });

    if (!createResponse.ok) {
      const errText = await createResponse.text();
      throw new Error(`Provisioning failed: ${errText}`);
    }

    const newProject = await createResponse.json();
    return {
      project: newProject,
      isNew: true,
      dbPass: dbPass
    };
  }

  static async waitForProjectActive(projectId: string, accessToken: string) {
    console.log(`⏳ [Trymate] Waiting for project ${projectId} to be ACTIVE_HEALTHY...`);

    // Poll for status
    for (let i = 0; i < 40; i++) { // Wait up to 3-4 minutes
      const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ACTIVE_HEALTHY') {
          console.log(`✅ [Trymate] Project is ACTIVE_HEALTHY.`);
          return data; // Return project data to get region/config
        }
        console.log(`Running Check (${i}/40): Status is ${data.status}...`);
      } else {
        console.warn(`Check failed: ${res.status}`);
      }

      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error('Project failed to become active in time.');
  }

  static async synchronizeSchema(projectId: string, accessToken: string, dbPass: string) {
    // SLEDGEHAMMER: Global SSL Bypass for this specific provisioning thread
    const originalReject = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    console.log(`🤖 [Trymate] Injecting Neural Schema into ${projectId}...`);

    try {
      // 1. Wait for Project to be HEALTHY (via Management API)
      const projectDetails = await this.waitForProjectActive(projectId, accessToken);
      const region = projectDetails.region || 'us-east-1';

      // 2. Derive Connection Strings
      const poolerHost = `aws-0-${region}.pooler.supabase.com`;
      const poolerUser = `postgres.${projectId}`;

      console.log(`🔌 [Trymate] Connecting via Pooler: ${poolerHost}:6543...`);

      const { Client } = await import('pg');

      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const client = new Client({
          host: poolerHost,
          port: 6543,
          user: poolerUser,
          password: dbPass,
          database: 'postgres',
          connectionTimeoutMillis: 15000,
          ssl: {
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined
          }
        });

        try {
          await client.connect();
          console.log('✅ [Trymate] Connected to Database!');

          await client.query(BYOI_SCHEMA_SQL);
          console.log(`✅ [Trymate] Schema injected successfully.`);

          await client.end();
          return { success: true };

        } catch (err: any) {
          attempts++;
          console.warn(`⚠️ [Trymate] SQL Connect Error (Attempt ${attempts}): ${err.message}`);

          try { await client.end(); } catch { }

          if (attempts < maxAttempts) {
            console.log(`⏳ Waiting for DB to accept connections...`);
            await new Promise(r => setTimeout(r, 5000));
          } else {
            throw err;
          }
        }
      }
      throw new Error('Failed to synchronize schema after multiple attempts.');
    } finally {
      // Restore original security setting
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalReject;
    }
  }
}
