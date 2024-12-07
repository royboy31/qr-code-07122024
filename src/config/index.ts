interface Config {
  domain: string;
  apiUrl: string;
  isProduction: boolean;
}

const getConfig = (): Config => {
  const env = import.meta.env.MODE;
  const isProduction = env === 'production';

  return {
    domain: isProduction 
      ? import.meta.env.VITE_PRODUCTION_DOMAIN || window.location.origin
      : window.location.origin,
    apiUrl: import.meta.env.VITE_SUPABASE_URL,
    isProduction
  };
};

export const config = getConfig();