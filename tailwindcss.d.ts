declare module 'tailwindcss' {
  import { Config} from 'tailwindcss/types/config';
  const tailwindcss: (config: Config) => void;
  export default tailwindcss;
}