import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimizaciones de rendimiento
  compress: true,
  poweredByHeader: false,
  // Optimizar bundles (compatible con Turbopack y Webpack)
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
  },
  // Configuración de Webpack solo para builds sin Turbopack
  // Turbopack maneja el code splitting automáticamente, así que esta config solo se usa en builds de producción
};

export default nextConfig;
