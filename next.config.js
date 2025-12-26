/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  // Only enable standalone output on non-Windows platforms (e.g. Linux/Cloud Run)
  // Windows file systems format forbids colons in filenames (produced by async_hooks tracing), causing EINVAL errors.
  output: process.platform === 'win32' ? undefined : 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ['@xyflow/react'],
};

export default nextConfig;
