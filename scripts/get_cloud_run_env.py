import os
import subprocess
import json

def get_env():
    try:
        result = subprocess.run(
            ['gcloud', 'run', 'services', 'describe', 'frontend', '--project', 'tryliate-production-v1', '--region', 'us-central1', '--format', 'json'],
            capture_output=True, text=True, check=True
        )
        data = json.loads(result.stdout)
        envs = data['spec']['template']['spec']['containers'][0].get('env', [])
        for env in envs:
            if env.get('name') == 'NEXT_PUBLIC_SITE_URL':
                print(f"NEXT_PUBLIC_SITE_URL={env.get('value')}")
            if env.get('name') == 'SUPABASE_OAUTH_CLIENT_ID':
                print(f"SUPABASE_OAUTH_CLIENT_ID={env.get('value')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_env()
